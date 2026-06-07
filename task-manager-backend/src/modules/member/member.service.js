import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import redisClient from "./../../config/redis.config.js";
import ApiError from "./../../errors/ApiError.js";
import slugify from "../../utils/slug.util.js";
import generateTokens from "../../utils/token.util.js";
import logger from "../../config/logger.config.js";
import env from "./../../config/env.config.js";
import generateInvitePayload from "./../../utils/invite.util.js";
import { emailQueue } from "./../../queues/email.queue.js";
import { getRoleByOrgId } from "../role/role.respository.js";
import { buildInviteEmail } from "./../../utils/email-template.util.js";
import { getSocketIoInstance } from "../../config/socket.config.js";
import {
  getMemberById,
  getMembers,
  getExistingUsersAndMembers,
  createMember,
  bulkInsertMembers,
  getMemberByInviteEmailAndOrg,
  updateMemberDetails,
} from "./member.repository.js";
import {
  createUser,
  findUserByEmail,
  getUserByEmailArray,
  updateUserById,
} from "../user/user.repository.js";

const invalidateMemberCache = async (organizationId, userId) => {
  try {
    const cacheKey = `org:${organizationId}:member:${userId}`;
    await redisClient.del(cacheKey);
    logger.info(
      `[Redis] Cleared cache for user ${userId} in org ${organizationId}`,
    );
  } catch (error) {
    logger.error("[Redis Invalidation Error]:", error);
  }
};

const getMemberService = async (organizationId, queryParams) => {
  const members = await getMembers(organizationId, queryParams);
  if (!members) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "No Members found in this organization.",
    );
  }

  return members;
};

const getMemberByIdService = async (organizationId, memberId) => {
  const member = await getMemberById(organizationId, memberId);

  if (!member) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Member not found in this organization.",
    );
  }

  return member;
};

const inviteSingleMember = async (
  organizationId,
  adminId,
  rawEmail,
  rawRoleName,
) => {
  const email = rawEmail.toLowerCase().trim();
  const roleName = slugify(rawRoleName);

  const orgRoles = await getRoleByOrgId(organizationId);
  const matchedRole = orgRoles.find((r) => slugify(r.name) === roleName);

  if (!matchedRole) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Role '${rawRoleName}' does not exist.`,
    );
  }

  // 1. Fetch both Global Users and Local Members
  const { globalUsers, members } = await getExistingUsersAndMembers(
    organizationId,
    [email],
  );

  // 2. Match them to our specific email
  const globalUser = globalUsers.find(
    (u) => u.email === email || u.secondaryEmail === email,
  );
  const existingMember = members.find(
    (m) =>
      m.inviteEmail === email ||
      (globalUser && m.userId?.toString() === globalUser._id.toString()),
  );
  console.log("Existing member found:", existingMember, globalUsers);

  if (globalUser) {
    // if (globalUser.isDeleted || globalUser.status === "deleted") {
    //   throw new ApiError(
    //     HTTP_STATUS.FORBIDDEN,
    //     "This user account has been deactivated platform-wide and cannot be invited.",
    //   );
    // }
    if (globalUser.status === "suspended") {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "This user is suspended from the platform and cannot be invited.",
      );
    }
  }

  const { job, inviteExpiresAt } = generateInvitePayload({
    email,
    organizationId,
    adminId,
  });
  // 3. Handle all possible scenarios with this single if-else block
  let member;
  if (existingMember) {
    if (["active", "invited"].includes(existingMember.status)) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User is already in the workspace or invited.",
      );
    }
    if (existingMember.status === "suspended") {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "This user is suspended. Please reactivate them from the dashboard.",
      );
    }

    if (existingMember.isDeleted) {
      member = await updateMemberDetails(organizationId, existingMember._id, {
        $set: {
          status: "invited",
          isDeleted: false,
          isArchived: false,
          roleId: matchedRole._id,
          inviteExpiresAt,
          userId: globalUser ? globalUser._id : existingMember.userId,
          deletedAt: null,
          deletedBy: null,
        },
        $inc: { inviteResendCount: 1 },
      });
    }
  } else {
    member = await createMember({
      organizationId,
      inviteEmail: email,
      roleId: matchedRole._id,
      invitedBy: adminId,
      inviteExpiresAt,
      status: "invited",
      userId: globalUser ? globalUser._id : null,
    });
  }

  await emailQueue.add(job.name, job.data, job.opts);

  return member;
};

const processBulkInvites = async (organizationId, adminId, excelData) => {
  const orgRoles = await getRoleByOrgId(organizationId);
  const roleMap = new Map(orgRoles.map((r) => [slugify(r.name), r]));

  const results = { successful: [], failed: [] };
  const emailJobs = [];
  const bulkOperations = [];

  // 1. Clean Data & Map Existing Members
  const cleanedData = excelData.map((row) => ({
    email: row.Email.toLowerCase().trim(),
    roleSlug: slugify(row.Role),
    rawRole: row.Role,
  }));

  const uniqueRows = Array.from(
    new Map(cleanedData.map((row) => [row.email, row])).values(),
  );
  const emailsToProcess = uniqueRows.map((r) => r.email);

  const { globalUsers, members } = await getExistingUsersAndMembers(
    organizationId,
    emailsToProcess,
  );

  // 2. Create fast lookups
  const globalUserMap = new Map(globalUsers.map((u) => [u.email, u]));
  const memberMap = new Map();
  members.forEach((m) => {
    if (m.inviteEmail) memberMap.set(m.inviteEmail, m);
    if (m.userId) {
      const foundUser = globalUsers.find(
        (u) => u._id.toString() === m.userId.toString(),
      );
      if (foundUser) memberMap.set(foundUser.email, m);
    }
  });

  const batchId = crypto.randomUUID();

  // EXACTLY 48 HOURS EXPIRATION
  const inviteExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // 3. Process each row
  for (const row of uniqueRows) {
    const { email, roleSlug, rawRole } = row;

    const matchedRole = roleMap.get(roleSlug);
    if (!matchedRole) {
      results.failed.push({
        email,
        reason: `Role '${rawRole}' does not exist.`,
      });
      continue;
    }

    const rateLimitKey = `rate-limit:invite:${organizationId}:${email}`;
    if (await redisClient.get(rateLimitKey)) {
      results.failed.push({
        email,
        reason: "An invite was just sent to this email (wait 60s).",
      });
      continue;
    }

    const globalUser = globalUserMap.get(email);
    if (globalUser && globalUser.status === "suspended") {
      results.failed.push({
        email,
        reason: "Account is suspended platform-wide.",
      });
      continue;
    }

    const existingMember = memberMap.get(email);
    if (existingMember) {
      if (["active", "invited"].includes(existingMember.status)) {
        results.failed.push({
          email,
          reason: "User is already active or invited.",
        });
        continue;
      }
      if (existingMember.status === "suspended") {
        results.failed.push({
          email,
          reason: "User is suspended and cannot be re-invited.",
        });
        continue;
      }
    }

    const { job } = generateInvitePayload({
      email,
      organizationId,
      adminId,
      batchId,
      inviteExpiresAt,
    });

    emailJobs.push(job);
    results.successful.push({ email });

    // EXACTLY 60 SECONDS RATE LIMIT
    await redisClient.setex(rateLimitKey, 60, "locked");

    // Build the Mongoose bulkWrite array
    if (existingMember && existingMember.isDeleted) {
      bulkOperations.push({
        updateOne: {
          filter: { _id: existingMember._id },
          update: {
            $set: {
              status: "invited",
              isDeleted: false,
              isArchived: false, // If applicable
              roleId: matchedRole._id,
              inviteExpiresAt: inviteExpiresAt,
              deletedAt: null,
              deletedBy: null,
              ...(globalUser && { userId: globalUser._id }), // The 'undefined' fix!
            },
            $inc: { inviteResendCount: 1 },
          },
        },
      });
    } else {
      bulkOperations.push({
        insertOne: {
          document: {
            organizationId,
            inviteEmail: email,
            roleId: matchedRole._id,
            invitedBy: adminId,
            inviteExpiresAt: inviteExpiresAt,
            status: "invited",
            ...(globalUser && { userId: globalUser._id }), // The 'undefined' fix!
          },
        },
      });
    }
  }

  // 4. Execute Mass Database & Queue Operations
  if (bulkOperations.length > 0) {
    try {
      await Member.bulkWrite(bulkOperations);

      await redisClient.hset(`batch:${batchId}`, {
        total: emailJobs.length,
        processed: 0,
      });
      await redisClient.expire(`batch:${batchId}`, 86400); // Batch tracking expires in 24h
      await emailQueue.addBulk(emailJobs);
    } catch (error) {
      const keysToRollback = results.successful.map(
        (res) => `rate-limit:invite:${organizationId}:${res.email}`,
      );

      if (keysToRollback.length > 0) {
        await redisClient.del(...keysToRollback);
      }
      throw ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "An error occurred while processing bulk invites. Please try again.",
      );
    }
  }

  return results;
};

const verifyInviteService = async (token) => {
  // 1. Check Redis Blacklist
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This invitation link has already been used.",
    );
  }

  // 2. Decode Token
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    console.log("Decoded invite token:", decoded);
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invitation link is invalid or has expired.",
    );
  }

  // 3. Check Member Status
  const member = await getMemberByInviteEmailAndOrg(
    decoded.email,
    decoded.organizationId,
  );

  if (!member)
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invitation not found.");

  // Use lowercase "invited" to match database schema
  if (["expired", "cancelled"].includes(member.status)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This invitation is no longer valid. Please contact your administrator.",
    );
  }

  // 4. Check if Global User already exists (Check Primary AND Secondary email)
  const existingUser = await getUserByEmailArray([decoded.email]);

  return {
    email: decoded.email,
    organizationId: decoded.organizationId,
    userExists: !!existingUser,
    invitedBy: member.invitedBy,
  };
};

const acceptInviteService = async (token, userData) => {
  // 1. Securely re-verify the token and get exact state
  const { email, organizationId, userExists, invitedBy } =
    await verifyInviteService(token);

  const { name, password, profilePicture } = userData;

  const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    // Look up the user by primary or secondary email
    const existingUser = await getUserByEmailArray([email], session);
    let user;

    // SCENARIO A: Brand New User
    if (!existingUsers || existingUsers.length === 0) {
      if (!password || !name) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Name and password are required for new users.",
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const [newUser] = await createMember(
        {
          email,
          name,
          password: hashedPassword,
          avatarUrl: profilePicture || "",
          isInvited: true,
          status: "active",
        },
        session,
      );
      user = newUser;
    }
    // SCENARIO B: Existing Global User
    else {
      const updatePayload = {};
      if (name) updatePayload.name = name;
      if (profilePicture) updatePayload.avatarUrl = profilePicture;

      console.log("Existing user accepted invite:", {
        existingUser,
        updatePayload,
      });
      if (Object.keys(updatePayload).length > 0) {
        await updateUserById(existingUser?.[0]?._id, updatePayload, session);
      }
      user = { ...existingUser?.[0], ...updatePayload };
    }

    // SCENARIO C: Activate Member Schema
    const member = await getMemberByInviteEmailAndOrg(
      email,
      organizationId,
      session,
    );
    const now = new Date();

    // Map the Global User ID to the Member profile permanently
    await updateMemberDetails(
      organizationId,
      member._id,
      {
        status: "active",
        userId: user._id,
        joiningDate: now,
        acceptedAt: now,
      },
      session,
    );

    // await session.commitTransaction();

    // POST-TRANSACTION ACTIONS:
    // 1. Blacklist the token so it can never be used again (Expire in 2 days)
    await redisClient.setex(`blacklist:${token}`, 172800, "true");

    // 2. Clear the rate limit key (if it existed) so we don't have hanging caches
    await redisClient.del(`rate-limit:invite:${organizationId}:${email}`);

    // 3. Generate Auth Tokens
    const { accessToken, refreshToken } = await generateTokens(
      user._id,
      user.email,
    );

    // 4. Notify the Admin
    const io = getSocketIoInstance();
    if (io && invitedBy) {
      io.to(invitedBy.toString()).emit("notification", {
        type: "SUCCESS",
        message: `${user.name} has joined the workspace!`,
      });
    }

    return { user, accessToken, refreshToken };
  } catch (error) {
    // await session.abortTransaction();
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "An error occurred while accepting the invite. Please try again.",
    );
  } finally {
    session.endSession();
  }
};

const reinviteMemberService = async (organizationId, memberId, adminId) => {
  const member = await getMemberById(organizationId, memberId);
  if (!member) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Member not found.");

  if (member.status === "active") {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Member is already active.");
  }
  if (member.status === "suspended") {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Cannot resend invite to a suspended user.",
    );
  }

  // 1. REDIS RATE LIMITING
  const rateLimitKey = `rate-limit:invite:${organizationId}:${member.inviteEmail}`;
  if (await redisClient.get(rateLimitKey)) {
    throw new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      "An invite was just sent. Please wait 60 seconds before resending.",
    );
  }

  // 2. Generate Payload Synchronously
  const { job, inviteExpiresAt } = generateInvitePayload({
    email: member.inviteEmail,
    organizationId,
    adminId,
  });

  // 3. Update DB
  const updatedMember = await updateMemberDetails(organizationId, memberId, {
    $set: {
      status: "invited",
      inviteExpiresAt: inviteExpiresAt,
    },
    $inc: { inviteResendCount: 1 },
  });

  // 4. Lock Redis & Queue Email
  await redisClient.setex(rateLimitKey, 60, "locked");
  await emailQueue.add(job.name, job.data, job.opts);

  return updatedMember;
};

const cancelInviteService = async (
  organizationId,
  invitedMemberId,
  adminId,
) => {
  const member = await getMemberById(organizationId, invitedMemberId);
  console.log("invited member", member);
  if (!member) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Member not found.");

  if (member.status !== "invited") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Only pending invites can be cancelled.",
    );
  }

  const cancelledMember = await updateMemberDetails(
    organizationId,
    invitedMemberId,
    {
      status: "cancelled",
      isDeleted: true,
      inviteExpiresAt: null,
      deletedAt: new Date(),
      deletedBy: adminId,
    },
  );

  // Clean up Redis
  try {
    const keysToDelete = [];

    // A. Clear the rate limit so the admin can instantly re-invite if needed
    if (member.inviteEmail) {
      keysToDelete.push(
        `rate-limit:invite:${organizationId}:${member.inviteEmail}`,
      );
    }

    // B. If the user already had a global account mapped, clear their org cache
    if (member.userId) {
      keysToDelete.push(`org:${organizationId}:member:${member.userId}`);
    }

    if (keysToDelete.length > 0) {
      await redisClient.del(...keysToDelete);
    }
  } catch (redisError) {
    logger.error(
      `[Redis] Failed to clear caches on invite cancellation:`,
      redisError,
    );
  }

  return cancelledMember;
};

const memeberSuspendService = async (organizationId, memberId) => {
  console.log("Updating member details service:", {
    organizationId,
    memberId,
  });
  const suspendedMember = await updateMemberDetails(organizationId, memberId, {
    status: "suspended",
  });

  if (!suspendedMember) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Member not found in this organization.",
    );
  }

  await invalidateMemberCache(organizationId, suspendedMember.userId);

  return suspendedMember;
};

const memeberDeleteService = async (organizationId, memberId, userId) => {
  const deletedMember = await updateMemberDetails(organizationId, memberId, {
    status: "suspended",
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: userId,
  });

  if (!deletedMember) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Member not found in this organization.",
    );
  }

  await invalidateMemberCache(organizationId, deletedMember.userId);

  return deletedMember;
};

export {
  getMemberService,
  getMemberByIdService,
  inviteSingleMember,
  processBulkInvites,
  verifyInviteService,
  acceptInviteService,
  reinviteMemberService,
  cancelInviteService,
  memeberSuspendService,
  memeberDeleteService,
};
