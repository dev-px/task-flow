import express from "express";
import requireAuth from "./../../middlewares/auth.middleware.js";
import checkPlan from "../../middlewares/checkPlan.middleware.js";
import validate from "./../../middlewares/validation.middleware.js";
import requireProjectAccess from "./../../middlewares/project.middleware.js";
import validateRequiredPermissions from "../../middlewares/permission.middleware.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  archiveProjectController,
  deleteProjectController,
  addProjectMemberController,
  removeProjectMemberController,
  removeAllProjectMembersController,
} from "./project.controller.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import { orgParamsSchema } from "../organization/organization.validation.js";
import {
  newProjectBodySchema,
  projectParamSchema,
  projectQuerySchema,
  updateProjectBodySchema,
  projectMemberParamSchema,
  addProjectMemberBodySchema,
} from "./project.validation.js";

const router = express.Router({ mergeParams: true });

// get all projects for a member
router.get(
  "/",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_READ),
  validate(projectQuerySchema, "query"),
  getAllProjectsController,
);

// create new project
router.post(
  "/",
  requireAuth,
  validate(orgParamsSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_CREATE),
  validate(newProjectBodySchema, "body"),
  checkPlan("projects"),
  createProjectController,
);

// get project by projectId
router.get(
  "/:projectId",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_READ),
  requireProjectAccess,
  getProjectByIdController,
);

// update project by projectId
router.patch(
  "/:projectId",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_EDIT),
  requireProjectAccess,
  validate(updateProjectBodySchema, "body"),
  updateProjectController,
);

// Archive a project
router.patch(
  "/:projectId/archive",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_EDIT),
  requireProjectAccess,
  archiveProjectController,
);

// Delete a project
router.delete(
  "/:projectId",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_DELETE),
  requireProjectAccess,
  deleteProjectController,
);

// Add new member in project
router.post(
  "/:projectId/members",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_EDIT),
  requireProjectAccess,
  validate(addProjectMemberBodySchema, "body"),
  // Optionally add checkPlan("project_members") here if you decide to bill by project capacity
  addProjectMemberController,
);

// Remove all members from the project
router.delete(
  "/:projectId/members",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_EDIT),
  requireProjectAccess,
  removeAllProjectMembersController,
);

// Remove a single member from this project
router.delete(
  "/:projectId/members/:memberId",
  requireAuth,
  validate(projectMemberParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.PROJECT_EDIT),
  requireProjectAccess,
  removeProjectMemberController,
);

export default router;
