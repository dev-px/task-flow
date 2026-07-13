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
  inviteData,
  adminId,
) => {
  // FIX 1: Destructure 'role' as 'roleId' since the frontend passes an ID
  const { name, email: rawEmail, role: roleId, designation } = inviteData;
  const email = rawEmail.toLowerCase().trim();

  // Pass _id: roleId to your repository function
  const orgRoles = await getRoleByOrgId({ organizationId, _id: roleId });

  if (!orgRoles || orgRoles.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Role does not exist.`,
    );
  }

  // Define matchedRole so you can use it down below!
  const matchedRole = orgRoles[0];

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

  if (globalUser) {
    if (globalUser.status === "suspended") {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "This user is suspended from the platform and cannot be invited.",
      );
    }
  }

  const rateLimitKey = `rate-limit:invite:${organizationId}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    throw new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      "An invite was just sent. Please wait 60 seconds before resending.",
    );
  }

  const { job, inviteExpiresAt } = generateInvitePayload({
    email,
    organizationId,
    adminId,
  });

  // 3. Handle all possible scenarios with this single if-else block
  let member;
  if (existingMember) {
    // existing member invite
    if (existingMember.isDeleted) {
      member = await updateMemberDetails(organizationId, existingMember._id, {
        $set: {
          status: "invited",
          isDeleted: false,
          isArchived: false,
          roleId: matchedRole._id,
          inviteExpiresAt,
          invitedBy: adminId,
          userId: globalUser ? globalUser._id : existingMember.userId,
          deletedAt: null,
          deletedBy: null,
          designation
        },
        $inc: { inviteResendCount: 1 },
      });
    }
    else if (["active", "invited"].includes(existingMember.status)) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User is already in the workspace or invited.",
      );
    }
    else if (existingMember.status === "suspended") {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "This user is suspended. Please reactivate them from the dashboard.",
      );
    }
    else if (["expired", "cancelled"].includes(existingMember.status)) {
      member = await updateMemberDetails(organizationId, existingMember._id, {
        $set: {
          status: "invited",
          roleId: matchedRole._id,
          inviteExpiresAt,
          invitedBy: adminId,
          designation
        },
        $inc: { inviteResendCount: 1 },
      });
    }

  } else {
    // new member
    member = await createMember({
      organizationId,
      designation,
      inviteEmail: email,
      roleId: matchedRole._id,
      invitedBy: adminId,
      inviteExpiresAt,
      status: "invited",
      userId: globalUser ? globalUser._id : null,
    });
  }

  await redisClient.setex(rateLimitKey, 60, "locked");
  await emailQueue.add(job.name, job.data, job.opts);

  return member;
};

const processBulkInvites = async (organizationId, adminId, requestingMember, excelData) => {
  const orgRoles = await getRoleByOrgId({ organizationId });
  const roleMap = new Map(orgRoles.map((r) => [r.slug, r]));

  // check requesting memeber is owner or admin
  if (!requestingMember)
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a member of this organization."
    );

  // Map their role ID back to the role slug
  const requestingRoleSlug = orgRoles.find(r =>
    r._id.toString() === requestingMember.roleId._id.toString())?.slug;

  const results = { successful: [], failed: [] };
  const emailJobs = [];
  const bulkOperations = [];

  // 2. Clean Data
  const cleanedData = excelData.map((row) => ({
    email: row.email.toLowerCase().trim(),
    roleSlug: slugify(row.role),
    rawRole: row.role,
    designation: row.designation ? row.designation.trim() : "",
  }));

  const uniqueRows = Array.from(
    new Map(cleanedData.map((row) => [row.email, row])).values(),
  );
  const emailsToProcess = uniqueRows.map((r) => r.email);

  const { globalUsers, members } = await getExistingUsersAndMembers(
    organizationId,
    emailsToProcess,
  );

  // 3. Create fast lookups
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
  // console.log("memberMap", memberMap);

  const batchId = crypto.randomUUID();
  const inviteExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // 4. Process each row
  for (const row of uniqueRows) {
    const { email, roleSlug, rawRole, designation } = row;

    const matchedRole = roleMap.get(roleSlug);
    if (!matchedRole) {
      results.failed.push({ email, reason: `Role '${rawRole}' does not exist.` });
      continue;
    }

    // STRICT HIERARCHY CHECKS
    if (roleSlug === "owner") {
      results.failed.push({ email, reason: "Cannot invite users as Workspace Owner." });
      continue;
    }
    if (roleSlug === "admin" && requestingRoleSlug !== "owner") {
      results.failed.push({ email, reason: "Only the Workspace Owner can invite new Admins." });
      continue;
    }

    const rateLimitKey = `rate-limit:invite:${organizationId}:${email}`;
    // console.log("rateLimitKey", rateLimitKey, email)
    if (await redisClient.get(rateLimitKey)) {
      results.failed.push({ email, reason: "An invite was just sent to this email (wait 60s)." });
      continue;
    }

    const globalUser = globalUserMap.get(email);
    if (globalUser && globalUser.status === "suspended") {
      results.failed.push({ email, reason: "Account is suspended platform-wide." });
      continue;
    }

    const existingMember = memberMap.get(email);
    let shouldQueueEmail = false; // Flag to tell us if we should send the email

    // MEMBER SCENARIOS
    if (existingMember) {
      // SCENARIO A: Resurrect Deleted User (Must be checked FIRST)
      if (existingMember.isDeleted) {
        bulkOperations.push({
          updateOne: {
            filter: { _id: existingMember._id },
            update: {
              $set: {
                status: "invited",
                isDeleted: false,
                isArchived: false,
                roleId: matchedRole._id,
                designation: designation,
                inviteExpiresAt: inviteExpiresAt,
                invitedBy: adminId,
                deletedAt: null,
                deletedBy: null,
                ...(globalUser && { userId: globalUser._id }),
              },
              $inc: { inviteResendCount: 1 },
            },
          },
        });
        shouldQueueEmail = true;
      }
      // SCENARIO B: Already Active/Invited
      else if (["active", "invited"].includes(existingMember.status)) {
        results.failed.push({ email, reason: "User is already active or invited." });
        continue;
      }
      // SCENARIO C: Suspended
      else if (existingMember.status === "suspended") {
        results.failed.push({ email, reason: "User is suspended and cannot be re-invited." });
        continue;
      }
      // SCENARIO D: Expired or Cancelled Invite
      else if (["expired", "cancelled"].includes(existingMember.status)) {
        bulkOperations.push({
          updateOne: {
            filter: { _id: existingMember._id },
            update: {
              $set: {
                status: "invited",
                roleId: matchedRole._id,
                designation: designation, // Set designation
                inviteExpiresAt: inviteExpiresAt,
                invitedBy: adminId,
              },
              $inc: { inviteResendCount: 1 },
            },
          },
        });
        shouldQueueEmail = true;
      }

    } else {
      // SCENARIO E: New User
      console.log("checking user", email)
      bulkOperations.push({
        insertOne: {
          document: {
            organizationId,
            inviteEmail: email,
            roleId: matchedRole._id,
            designation: designation,
            invitedBy: adminId,
            inviteExpiresAt: inviteExpiresAt,
            status: "invited",
            ...(globalUser && { userId: globalUser._id }),
          },
        },
      });
      shouldQueueEmail = true;
    }

    // Only generate payload & Redis lock if the DB operation was actually pushed
    if (shouldQueueEmail) {
      // console.log("shouldQueueEmail", shouldQueueEmail)
      const { job } = generateInvitePayload({
        email,
        organizationId,
        adminId,
        batchId,
        inviteExpiresAt,
      });

      emailJobs.push(job);
      results.successful.push({ email });
      await redisClient.setex(rateLimitKey, 60, "locked");
    }
  }

  // 5. Execute Mass Database & Queue Operations
  if (bulkOperations.length > 0) {
    try {
      console.log("bulkOperations", bulkOperations)
      const res = await bulkInsertMembers(bulkOperations);
      console.log("res -->", res);
      await redisClient.hset(`batch:${batchId}`, {
        total: emailJobs.length,
        processed: 0,
      });
      await redisClient.expire(`batch:${batchId}`, 86400);
      await emailQueue.addBulk(emailJobs);
    } catch (error) {
      console.error("🚨 BULK WRITE CRASHED:");
      console.error(error.message);
      if (error.writeErrors) console.error(JSON.stringify(error.writeErrors, null, 2));
      const keysToRollback = results.successful.map(
        (res) => `rate-limit:invite:${organizationId}:${res.email}`,
      );
      if (keysToRollback.length > 0) await redisClient.del(...keysToRollback);

      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "An error occurred while processing bulk invites. Please try again.",
      );
    }
  }
  // console.log("result for bulk invite", results)
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
    // console.log("Decoded invite token:", decoded);
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
    userExists: existingUser.length > 0,
    invitedBy: member.invitedBy,
  };
};

const acceptInviteService = async (token, userData) => {
  // 1. Securely re-verify the token and get exact state
  console.log("veryify invite", userData)
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
    if (!existingUser || existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await createUser(
        {
          email,
          name,
          password: hashedPassword,
          avatarUrl: "",
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
    const updatedMember = await updateMemberDetails(
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
    await session.abortTransaction();
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "An error occurred while accepting the invite. Please try again.",
    );
  } finally {
    session.endSession();
  }
};

const reinviteMemberService = async (organizationId, memberId, adminId) => {
  const member = await getMemberByIdService(organizationId, memberId);

  if (member.status === "active") {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Member is already active in this organization.");
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

const editMemberByIdService = async (organizationId, currMemeberDetails, TargetMemeberId, memberData, userId) => {
  const targetMember = await getMemberByIdService(organizationId, TargetMemeberId);
  const { designation, roleId, additionalPermissions } = memberData;

  // only owner and admin can edit the details
  if (!['owner', 'admin'].includes(currMemeberDetails.roleId.slug)) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You do not have permission to edit roles."
    );
  }

  // stop admins to edit owner roles
  if (targetMember.role.slug === "owner" && currMemeberDetails.roleId.slug !== "owner") {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Admins cannot modify the Workspace Owner."
    );
  }

  if (targetMember.role.slug === "admin" && currMemeberDetails.roleId !== "owner") {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only the Owner can modify Admin permissions."
    );
  }

  if (targetMember.isDeleted) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Cannot modify a deleted member. Restore them first to make changes."
    );
  }
  if (targetMember.status === "cancelled") {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Cannot modify a cancelled invite. Please send a new invitation."
    );
  }

  const updatedMemberDetails = await updateMemberDetails(organizationId, TargetMemeberId, {
    additionalPermissions: additionalPermissions,
    designation: designation,
    roleId: roleId,
  })

  if (!updatedMemberDetails) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Unable to edit member details, role or permission. Please try again.",
    );
  }

  return updatedMemberDetails;
}

const cancelInviteService = async (
  organizationId,
  invitedMemberId,
  adminId,
) => {
  const member = await getMemberByIdService(organizationId, invitedMemberId);

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

const memeberSuspendService = async (organizationId, memberId, userId) => {
  const member = await getMemberByIdService(organizationId, memberId);

  // Prevent self-deletion
  if (member.user && member.user._id.toString() === userId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You cannot suspend your own account.",
    );
  }
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
  const member = await getMemberByIdService(organizationId, memberId);

  // prevent user to delete itself
  if (member.user && member.user._id.toString() === userId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You cannot delete your own account.",
    );
  }
  const deletedMember = await updateMemberDetails(organizationId, memberId, {
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
  editMemberByIdService,
  cancelInviteService,
  memeberSuspendService,
  memeberDeleteService,
};
