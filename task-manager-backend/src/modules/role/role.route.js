import express from "express";
import requireAuth from "../../middlewares/auth.middleware.js";
import validateRequiredPermissions from "../../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import requireOrganizationAccess from "../../middlewares/organization.middleware.js";
import {
  archiveRoleController,
  createNewRoleController,
  editRoleController,
  getAllRolesController,
} from "./role.controller.js";
import validate from "../../middlewares/validation.middleware.js";
import { orgParamsSchema } from "../organization/organization.validation.js";
import {
  archieveRoleJustificationSchema,
  editParamsRoleSchema,
  editRoleSchema,
  roleSchema,
} from "./role.validation.js";

const router = express.Router();

// get all roles within the organization
router.get(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ROLE_READ),
  getAllRolesController,
);

// create new role within the organziation
router.post(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ROLE_CREATE),
  validate(roleSchema, "body"),
  createNewRoleController,
);

// edit an role except system default role (like admin, owner, etc)
router.patch(
  "/:orgId/:roleId",
  requireAuth,
  validate(editParamsRoleSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ROLE_EDIT),
  validate(editRoleSchema, "body"),
  editRoleController,
);

router.patch(
  "/:orgId/:roleId",
  requireAuth,
  validate(editParamsRoleSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ROLE_ARCHIVE),
  validate(archieveRoleJustificationSchema, "body"),
  archiveRoleController,
);

export default router;
