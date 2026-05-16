import express from "express";
import requireAuth from "./../../middlewares/auth.middleware.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import validate from "./../../middlewares/validation.middleware.js";
import validateRequiredPermissions from "./../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "./../../constants/permissions.constant.js";
import { orgParamsSchema } from "../organization/organization.validation.js";
import {
  getMemberByIdController,
  getMemberController,
  inviteSingleMemberController,
  bulkInviteController,
  acceptInviteController,
  reinviteMemberController,
  cancelInviteController,
} from "./member.controller.js";
import {
  getMemberParams,
  getMembersByIdQuerySchema,
  getMembersQuerySchema,
  inviteSingleMemberSchema,
  bulkInviteSchema,
  acceptInviteBodySchema,
} from "./member.validation.js";

const router = express.Router({ mergeParams: true });

// shared Global Middleware Stack
const globalStack = [requireAuth, requireOrganizationAccess];

// permission-Specific Stacks
const readStack = [
  ...globalStack,
  validateRequiredPermissions(PERMISSIONS.MEMBER_READ),
];
const writeStack = [
  ...globalStack,
  validateRequiredPermissions(PERMISSIONS.MEMBER_CREATE),
];

// get all members
router.get(
  "/",
  validate(orgParamsSchema, "params"),
  ...readStack,
  validate(getMembersQuerySchema, "query"),
  getMemberController,
);

// get member by ID
router.get(
  "/:memberId",
  validate(getMemberParams, "params"),
  ...readStack,
  validate(getMembersByIdQuerySchema, "query"),
  getMemberByIdController,
);

// single invite
router.post(
  "/invite/single",
  ...writeStack,
  validate(inviteSingleMemberSchema, "body"),
  inviteSingleMemberController,
);

// bulk invite
router.post(
  "/invite/bulk",
  ...writeStack,
  validate(bulkInviteSchema, "body"),
  bulkInviteController,
);

// accept invite
router.post(
  "/accept-invite",
  validate(acceptInviteBodySchema, "query"),
  acceptInviteController,
);

// POST /invite/:memberId/reinvite
router.post(
  "/invite/:memberId/reinvite",
  ...writeStack,
  reinviteMemberController,
);

router.post("/invite/:memberId/cancel", ...writeStack, cancelInviteController);

export default router;
