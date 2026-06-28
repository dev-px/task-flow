import express from "express";
import {
  createOrganizationController,
  deleteOrgController,
  updateOrganizationController,
  viewAllOrganizationsController,
  viewOrgDetailController,
} from "./organization.controller.js";
import requireAuth from "./../../middlewares/auth.middleware.js";
import {
  createOrganizationSchema,
  orgParamsSchema,
  orgQuerySchema,
  updateOrganizationSchema,
} from "./organization.validation.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import validateRequiredPermissions from "./../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validation.middleware.js";

const router = express.Router();

// view all organizations that the user is a member of
router.get(
  "/",
  requireAuth,
  validate(orgQuerySchema, "query"),
  viewAllOrganizationsController,
);

// create a new organization
router.post(
  "/",
  requireAuth,
  validate(createOrganizationSchema, "body"),
  createOrganizationController,
);

// view particular organization detail
router.get(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ORG_READ),
  viewOrgDetailController,
);

// edit an organization details
router.patch(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ORG_EDIT),
  validate(updateOrganizationSchema, "body"),
  updateOrganizationController,
);

// delete organization
router.delete(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ORG_DELETE),
  deleteOrgController,
);

export default router;
