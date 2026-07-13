import express from "express";
import requireAuth from "./../../middlewares/auth.middleware.js";
import validate from "./../../middlewares/validation.middleware.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import validateRequiredPermissions from "./../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "./../../constants/permissions.constant.js";
import { orgParamsSchema } from "../organization/organization.validation.js";
import {
  getMemberController,
  bulkInviteController,
  verifyInviteController,
  acceptInviteController,
  cancelInviteController,
  getMemberByIdController,
  memeberDeleteController,
  editMemberByIdController,
  reinviteMemberController,
  memeberSuspendController,
  inviteSingleMemberController,
} from "./member.controller.js";
import {
  getMemberParams,
  bulkInviteSchema,
  getMembersQuerySchema,
  acceptInviteBodySchema,
  verifyInviteQuerySchema,
  editMemberDetailsSchema,
  inviteSingleMemberSchema,
  getMembersByIdQuerySchema,
} from "./member.validation.js";

const router = express.Router();

// verify-invite
router.get(
  "/verify-invite",
  validate(verifyInviteQuerySchema, "query"),
  verifyInviteController,
);

// accept invite
router.post(
  "/accept-invite",
  validate(verifyInviteQuerySchema, "query"),
  // validate(acceptInviteBodySchema, "body"),
  acceptInviteController,
);

// get all members
router.get(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_READ),
  validate(getMembersQuerySchema, "query"),
  getMemberController,
);

// single invite
router.post(
  "/:orgId/invite/single",
  requireAuth,
  validate(inviteSingleMemberSchema, "body"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_CREATE),
  inviteSingleMemberController,
);

// bulk invite
router.post(
  "/:orgId/invite/bulk",
  requireAuth,
  validate(bulkInviteSchema, "body"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_CREATE),
  bulkInviteController,
);

// reinvite
router.post(
  "/:orgId/invite/:invitedmemberId/reinvite",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_CREATE),
  reinviteMemberController,
);

// cancel invite
router.post(
  "/:orgId/invite/:invitedmemberId/cancel",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_CANCEL_INVITE),
  cancelInviteController,
);

// get member by ID
router.get(
  "/:orgId/:invitedmemberId",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_READ),
  validate(getMembersByIdQuerySchema, "query"),
  getMemberByIdController,
);

// edit member details and permissions
router.patch(
  "/:orgId/:invitedmemberId/editMember",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validate(editMemberDetailsSchema, "body"),
  validateRequiredPermissions(PERMISSIONS.MEMBER_EDIT),
  editMemberByIdController,
)

// suspend the Member
router.patch(
  "/:orgId/:invitedmemberId/suspend",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_REVOKED_ACCESS),
  memeberSuspendController,
);

// archive or soft delete the member
router.delete(
  "/:orgId/:invitedmemberId/delete",
  requireAuth,
  validate(getMemberParams, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.MEMBER_DELETE),
  memeberDeleteController,
);

export default router;
