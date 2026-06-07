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
  const { email, role } = req.body;
  const adminId = req.user.id;
  console.log("Inviting single member:", { orgId, email, role, adminId });
  const result = await inviteSingleMember(orgId, adminId, email, role);

  return successResponse(
    res,
    `Invitation successfully queued for ${email}`,
    result,
    HTTP_STATUS.CREATED,
  );
});

// Handle bulk member invitations from Excel data
const bulkInviteController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { data: excelData } = req.body; // Parsed JSON array from Excel uploader

  const adminId = req.user.id;
  const adminRoleLevel = req.user.roleLevel; // Check privilege escalation

  // Validate Excel data
  if (!excelData || !Array.isArray(excelData) || excelData.length === 0) {
    return res.status(400).json({ error: "No valid Excel data provided." });
  }

  // Process all invitations
  const { successful, failed } = await processBulkInvites(
    orgId,
    adminId,
    adminRoleLevel,
    excelData,
  );

  // Return partial success response (207 Multi-Status)
  return successResponse(
    res,
    `Processing complete. ${successful.length} queued, ${failed.length} failed.`,
    successful.length,
    HTTP_STATUS.PARTIAL_CREATED,
    { failedCount: failedCount, failedData: failed },
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
  const suspendedMember = await memeberSuspendService(orgId, invitedmemberId);

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
};
