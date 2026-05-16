import express from "express";
import {
  createOrganizationController,
  editOrganizationController,
  updateGeneralController,
  viewAllOrganizationsController,
} from "./organization.controller.js";
import requireAuth from "./../../middlewares/auth.middleware.js";
import {
  createOrganizationSchema,
  orgParamsSchema,
  updateGeneralSchema,
} from "./organization.validation.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import validateRequiredPermissions from "./../../middlewares/permission.middleware.js";
import validate from "../../middlewares/validation.middleware.js";

const router = express.Router();

// view all organizations that the user is a member of
router.get("/", requireAuth, viewAllOrganizationsController);

// create a new organization
router.post(
  "/",
  requireAuth,
  validateRequiredPermissions(PERMISSIONS.ORG_CREATE),
  validate(createOrganizationSchema, "body"),
  createOrganizationController,
);

// edit an organization details
router.patch(
  "/:orgId",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ORG_EDIT),
  validate(createOrganizationSchema, "body"),
  editOrganizationController,
);

// update general info for the organization
router.patch(
  "/:orgId/general",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.ORG_GENERAL_EDIT),
  validate(updateGeneralSchema, "body"),
  updateGeneralController,
);

export default router;
