import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "../../utils/async-handler.util.js";
import SUCCESS_MESSAGES from "./../../errors/success.messages.js";
import {
  acceptInviteService,
  cancelInviteService,
  getMemberByIdService,
  getMemberService,
  inviteSingleMember,
  processBulkInvites,
  reinviteMemberService,
} from "./member.service.js";

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

const getMemberByIdController = asyncHandler(async (req, res) => {
  const { orgId, memberId } = req?.params;
  const memeber = await getMemberByIdService(orgId, memberId, req.query);

  return successResponse(
    res,
    "Member fetched successfully",
    memeber,
    HTTP_STATUS.OK,
  );
});

const inviteSingleMemberController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { email, roleName } = req.body;

  // We assume you have an auth middleware that attaches the logged-in user to req.user
  const adminId = req.user.userId;

  if (!email || !roleName) {
    return res.status(400).json({ error: "Email and Role are required." });
  }

  // Call the Service layer you built in Step 5 (Part A)
  const result = await inviteSingleMember(orgId, adminId, email, roleName);

  return successResponse(
    res,
    `Invitation successfully queued for ${email}`,
    result,
    HTTP_STATUS.CREATED,
  );
});

const bulkInviteController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { data: excelData } = req.body; // The parsed JSON array from your frontend Excel uploader

  const adminId = req.user.userId;
  const adminRoleLevel = req.user.roleLevel; // Used if checking privilege escalation

  if (!excelData || !Array.isArray(excelData) || excelData.length === 0) {
    return res.status(400).json({ error: "No valid Excel data provided." });
  }

  const { successful, failed } = await processBulkInvites(
    orgId,
    adminId,
    adminRoleLevel,
    excelData,
  );

  // HTTP 207 Multi-Status - This tells the frontend "The request worked, but only parts of the data succeeded."
  return successResponse(
    res,
    `Processing complete. ${successful.length} queued, ${failed.length} failed.`,
    successful.length,
    HTTP_STATUS.PARTIAL_CREATED,
    { failedCount: failedCount, failedData: failed },
  );
});

const acceptInviteController = asyncHandler(async (req, res) => {
  const { token, ...userData } = req.body;
  const { user, accessToken, refreshToken } = await acceptInviteService(
    token,
    userData,
  );

  return successResponse(
    res,
    "Welcome to the workspace!",
    {
      user,
      accessToken,
      refreshToken,
    },
    HTTP_STATUS.OK,
  );
});

const reinviteMemberController = asyncHandler(async (req, res) => {
  const result = await reinviteMemberService(
    req.params.orgId,
    req.params.memberId,
    req.user.userId,
  );
  return successResponse(
    res,
    "Invite resent successfully",
    result,
    HTTP_STATUS.OK,
  );
});

const cancelInviteController = asyncHandler(async (req, res) => {
  const result = await cancelInviteService(
    req.params.orgId,
    req.params.memberId,
  );
  return successResponse(
    res,
    "Invite cancelled successfully",
    result,
    HTTP_STATUS.OK,
  );
});

export {
  getMemberController,
  getMemberByIdController,
  inviteSingleMemberController,
  bulkInviteController,
  acceptInviteController,
  reinviteMemberController,
  cancelInviteController
};
