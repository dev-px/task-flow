import env from "../../config/env.config.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";
import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "../../utils/async-handler.util.js";
import SUCCESS_MESSAGES from "./../../errors/success.messages.js";
import {
  acceptInviteService,
  cancelInviteService,
  editMemberByIdService,
  getMemberByIdService,
  getMemberService,
  inviteSingleMember,
  memeberDeleteService,
  memeberSuspendService,
  processBulkInvites,
  reinviteMemberService,
  verifyInviteService,
} from "./member.service.js";

// Fetch all members for an organization
const getMemberController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const memeber = await getMemberService(orgId, req.query);

  return successResponse(
    res,
    "Member fetched successfully",
    memeber,
    HTTP_STATUS.OK,
  );
});

// Fetch a specific member by ID
const getMemberByIdController = asyncHandler(async (req, res) => {
  const { orgId, invitedmemberId } = req?.params;
  const memeber = await getMemberByIdService(orgId, invitedmemberId, req.query);

  return successResponse(
    res,
    "Member fetched successfully",
    memeber,
    HTTP_STATUS.OK,
  );
});

// Send invitation to a single member
const inviteSingleMemberController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const result = await inviteSingleMember(orgId, req.body, req.user.id);

  return successResponse(
    res,
    `Invitation successfully queued for ${req.body.email}`,
    result,
    HTTP_STATUS.CREATED,
  );
});

// Handle bulk member invitations from Excel data
const bulkInviteController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { excelData } = req.body;
  const adminId = req.user.id;

  // Validate Excel data
  if (!excelData || !Array.isArray(excelData) || excelData.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "No valid Excel data provided."
    );
  }

  // Process all invitations
  const { successful, failed } = await processBulkInvites(
    orgId,
    adminId,
    req.member,
    excelData,
  );

  const successfulCount = successful.length;
  const failedCount = failed.length;

  const responsePayload = {
    successful,
    successfulCount,
    failed,
    failedCount,
  };

  // Determine HTTP Status and Message based on results
  let statusCode;
  let message;

  if (successfulCount > 0 && failedCount > 0) {
    // 1. Partial Success
    statusCode = 207;
    message = `Sent ${successfulCount} successful invites, but ${failedCount} failed.`;

  } else if (successfulCount === 0) {
    // 2. Total Failure
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Failed to send invites. All ${failedCount} invites failed.`;

  } else {
    // 3. Total Success
    statusCode = HTTP_STATUS.CREATED;
    message = `Successfully sent all ${successfulCount} invites!`;
  }

  // Return formatted response
  return successResponse(
    res,
    message,
    responsePayload,
    statusCode
  );
});

// Verify invitation token validity
const verifyInviteController = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const data = await verifyInviteService(token);

  return successResponse(res, "Invite is valid", data, HTTP_STATUS.OK);
});

// Accept an invitation and create user account
const acceptInviteController = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { ...userData } = req.body;
  const { user, accessToken, refreshToken } = await acceptInviteService(
    token,
    userData,
  );

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return successResponse(
    res,
    "Welcome to the workspace!",
    {
      user,
      accessToken,
    },
    HTTP_STATUS.OK,
  );
});

// Resend invitation to a member
const reinviteMemberController = asyncHandler(async (req, res) => {
  const result = await reinviteMemberService(
    req.params.orgId,
    req.params.invitedmemberId,
    req.user.id,
  );

  return successResponse(
    res,
    "Invite resent successfully",
    result,
    HTTP_STATUS.OK,
  );
});

// Cancel a pending invitation
const cancelInviteController = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const result = await cancelInviteService(
    req.params.orgId,
    req.params.invitedmemberId,
    adminId,
  );

  return successResponse(
    res,
    "Invite cancelled successfully",
    result,
    HTTP_STATUS.OK,
  );
});

// Suspend a member account
const memeberSuspendController = asyncHandler(async (req, res) => {
  const { orgId, invitedmemberId } = req.params;
  const suspendedMember = await memeberSuspendService(
    orgId,
    invitedmemberId,
    req.user.id,
  );

  return successResponse(
    res,
    "Member has successfully suspended",
    suspendedMember,
    HTTP_STATUS.OK,
  );
});

// Delete a member from organization
const memeberDeleteController = asyncHandler(async (req, res) => {
  const { orgId, invitedmemberId } = req.params;
  const deletedMember = await memeberDeleteService(
    orgId,
    invitedmemberId,
    req.user.id,
  );

  return successResponse(
    res,
    "Member has successfully Deleted",
    deletedMember,
    HTTP_STATUS.OK,
  );
});

const editMemberByIdController = asyncHandler(async (req, res) => {
  const { orgId, invitedmemberId } = req.params;
  const updatedMember = await editMemberByIdService(
    orgId,
    req.member,
    invitedmemberId,
    req.body,
    req.user.id
  );

  return successResponse(
    res,
    "Member has successfully Updated",
    updatedMember,
    HTTP_STATUS.OK,
  );

})

export {
  getMemberController,
  getMemberByIdController,
  inviteSingleMemberController,
  bulkInviteController,
  acceptInviteController,
  reinviteMemberController,
  cancelInviteController,
  memeberSuspendController,
  memeberDeleteController,
  verifyInviteController,
  editMemberByIdController
};
