import HTTP_STATUS from "../../constants/http-status.constant.js";
import redisClient from "./../../config/redis.config.js";
import { emailQueue } from "./../../queues/email.queue.js";
import ApiError from "./../../errors/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import slugify from "../../utils/slug.util.js";
import bcrypt from "bcrypt";
import generateTokens from "../../utils/token.util.js";
import mongoose from "mongoose";
import env from "./../../config/env.config.js";
import {
  getMemberById,
  getMembers,
  getExistingMembersByEmails,
  createMember,
  bulkInsertMembers,
  getMemberByInviteEmailAndOrg,
  generateSequentialEmployeeId,
  updateMemberDetails,
} from "./member.repository.js";
import { getSocketIoInstance } from "../../config/socket.config.js";
import { getRoleByOrgId } from "../role/role.respository.js";
import {
  createUser,
  findUserByEmail,
  updateUserById,
} from "../user/user.repository.js";

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

  const orgRoles = await getRolesByOrg(organizationId);
  const matchedRole = orgRoles.find(
    (r) => r.name.toLowerCase() === roleName.toLowerCase(),
  );
  if (!matchedRole)
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Role '${roleName}' does not exist.`,
    );

  const existingMember = await getExistingMembersByEmails(organizationId, [
    email,
  ]);
  if (existingMember.length > 0)
    throw new ApiError(HTTP_STATUS.CONFLICT, "User already invited/active.");

  // Use Utility
  const { inviteExpiresAt } = await generateAndQueueInvite({
    email,
    organizationId,
    adminId,
  });

  return await createMember({
    organizationId: organizationId,
    inviteEmail: email,
    roleId: matchedRole._id,
    invitedBy: adminId,
    inviteExpiresAt,
    status: "invited",
    designation: designation || "",
    workType: workType || "full-time",
  });
};

const processBulkInvites = async (organizationId, adminId, excelData) => {
  const orgRoles = await getRoleByOrgId(organizationId);

  // Create a fast dictionary (Map) of slugified roles from your DB
  // This turns O(N) lookups into O(1) instant lookups!
  const roleMap = new Map(orgRoles.map((r) => [slugify(r.name), r]));

  const inviteExpiry = new Date();
  inviteExpiry.setDate(inviteExpiry.getDate() + 2);

  const results = { successful: [], failed: [] };
  const membersToCreate = [];
  const emailJobs = [];

  // 1. Clean data ONE TIME upfront to stop redundant trimming
  const cleanedData = excelData.map((row) => ({
    email: row.Email.toLowerCase().trim(),
    roleSlug: slugify(row.Role),
    rawRole: row.Role,
    // Add these fields, handling potential Excel column casing
    designation: row.Designation || row.designation || "",
    workType: row.WorkType || row.workType || "full-time",
  }));

  // 2. Remove duplicates based on the cleaned email
  const uniqueRows = Array.from(
    new Map(cleanedData.map((row) => [row.email, row])).values(),
  );

  // 3. Fetch existing members
  const emailsToProcess = uniqueRows.map((r) => r.email);
  const existingMembers = await getExistingMembersByEmails(
    organizationId,
    emailsToProcess,
  );
  const existingEmails = new Set(existingMembers.map((m) => m.inviteEmail));

  const batchId = crypto.randomUUID();

  // 4. Process each row
  for (const row of uniqueRows) {
    const { email, roleSlug, rawRole, designation, workType } = row;

    // Filter A: Already in DB?
    if (existingEmails.has(email)) {
      results.failed.push({
        email,
        reason: "User is already invited or active.",
      });
      continue;
    }

    // Filter B: Redis Rate Limiting
    const rateLimitKey = `rate-limit:invite:${organizationId}:${email}`;
    if (await redisClient.get(rateLimitKey)) {
      results.failed.push({
        email,
        reason: "An invite was just sent to this email. Please wait.",
      });
      continue;
    }

    // Filter C: Fast Role Matching using Slug
    const matchedRole = roleMap.get(roleSlug);
    if (!matchedRole) {
      // If they typed "nmAnager", it will fail here cleanly without crashing
      results.failed.push({
        email,
        reason: `Role '${rawRole}' does not exist in this workspace.`,
      });
      continue;
    }

    // Passed all filters
    membersToCreate.push({
      organizationId: organizationId,
      inviteEmail: email,
      roleId: matchedRole._id,
      invitedBy: adminId,
      inviteExpiresAt: inviteExpiry,
      status: "invited",
      designation: designation,
      workType: workType,
    });

    const token = jwt.sign({ email, organizationId }, env.JWT_SECRET, {
      expiresIn: "2d",
    });

    emailJobs.push({
      name: "sendInviteEmail",
      data: { email, organizationId, token, adminId, batchId },
    });

    results.successful.push({ email });
    await redisClient.set(rateLimitKey, "locked", "EX", 60);
  }

  // 5. Execute Bulk Operations
  if (membersToCreate.length > 0) {
    await bulkInsertMembers(membersToCreate);

    await redisClient.hset(`batch:${batchId}`, {
      total: emailJobs.length,
      processed: 0,
    });
    // Server memory cleanup (expires in 24 hours)
    await redisClient.expire(`batch:${batchId}`, 86400);

    await emailQueue.addBulk(emailJobs);
  }

  return results;
};

const verifyInviteService = async (token) => {
  // 1. Verify Token & Redis Blacklist
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted)
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This invitation link has already been used.",
    );

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invitation link is invalid or has expired.",
    );
  }

  // 2. Check Member Status
  const member = await getMemberByInviteEmailAndOrg(
    decoded.email,
    decoded.organizationId,
  );
  if (!member)
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invitation not found.");
  if (member.status !== "INVITED")
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This invitation has already been accepted or revoked.",
    );

  // 3. Check if user already exists (tells frontend whether to show password field)
  const existingUser = await findUserByEmail(decoded.email);

  return {
    email: decoded.email,
    organizationId: decoded.organizationId,
    userExists: !!existingUser, // Returns true or false
    invitedBy: member.invitedBy,
  };
};

const acceptInviteService = async (token, userData) => {
  const { email, organizationId, userExists, invitedBy } =
    await verifyInviteService(token);

  // Extract user details AND optional member details coming from the frontend
  const { name, password, profilePicture } = userData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user = await findUserByEmail(email, session);

    // SCENARIO A: New User
    if (!user) {
      if (!password || !name) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Name and password are required for new users.",
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await createUser(
        {
          email,
          name,
          password: hashedPassword,
          avatarUrl: profilePicture || "",
        },
        session,
      );
    }
    // SCENARIO B: Existing User
    else {
      const updateData = {};
      if (name) updateData.name = name;
      if (profilePicture) updateData.avatarUrl = profilePicture;

      if (Object.keys(updateData).length > 0) {
        user = await updateUserById(user._id, updateData, session);
      }
    }

    // SCENARIO C: Process Member Schema
    const member = await getMemberByInviteEmailAndOrg(
      email,
      organizationId,
      session,
    );

    // 1. Generate sequential Employee ID atomically
    const employeeId = await generateSequentialEmployeeId(
      organizationId,
      session,
    );
    const now = new Date();

    // 2. Prepare all required backend-driven fields
    const memberUpdateData = {
      status: "active",
      userId: user._id,
      joiningDate: now,
      acceptedAt: now,
      employeeId: employeeId,
    };

    // 3. Save to Database
    await updateMemberDetails(member._id, memberUpdateData, session);

    // If everything up to this point succeeds, commit the changes to the database
    await session.commitTransaction();

    await redisClient.set(`blacklist:${token}`, "true", "EX", 172800);

    const { accessToken, refreshToken } = await generateTokens(user._id, email);

    const io = getSocketIoInstance();
    if (io && invitedBy) {
      io.to(invitedBy.toString()).emit("notification", {
        type: "SUCCESS",
        message: `${user.name} has joined the workspace!`,
      });
    }

    if (!user) return { user, accessToken, refreshToken };
  } catch (error) {
    // If ANY database operation fails (including the counter increment), abort everything
    await session.abortTransaction();
    throw error;
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

  // 1. REDIS RATE LIMITING FOR RE-INVITE
  const rateLimitKey = `rate-limit:invite:${organizationId}:${member.inviteEmail}`;
  const isLocked = await redisClient.get(rateLimitKey);

  if (isLocked) {
    throw new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      "An invite was just sent. Please wait 60 seconds before resending.",
    );
  }

  // 2. Generate and Queue
  const { inviteExpiresAt } = await generateAndQueueInvite({
    email: member.inviteEmail,
    organizationId,
    adminId,
  });

  // 3. Update DB and set Redis Lock
  const updatedMember = await updateMemberDetails(memberId, {
    status: "invited",
    inviteExpiresAt: inviteExpiresAt,
    $inc: { inviteResendCount: 1 },
  });

  await redisClient.set(rateLimitKey, "locked", "EX", 60);

  return updatedMember;
};

const cancelInviteService = async (organizationId, memberId) => {
  const member = await getMemberById(organizationId, memberId);
  if (!member) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Member not found.");

  if (member.status !== "invited") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Only pending invites can be cancelled.",
    );
  }

  return await updateMemberDetails(memberId, {
    status: "cancelled",
    inviteExpiresAt: null,
  });
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
};
