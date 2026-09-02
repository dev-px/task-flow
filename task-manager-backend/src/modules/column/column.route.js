// get all columns for a particular project  - done
import express from "express";
import requireAuth from "../../middlewares/auth.middleware.js";
import requireOrganizationAccess from "../../middlewares/organization.middleware.js";
import requireProjectAccess from "../../middlewares/project.middleware.js";
import validate from "../../middlewares/validation.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import {
    createColumnController,
    deleteColumnController,
    getColumnsController,
    updateColumnController,
} from "./column.controller.js";
import { columnParamsSchema, createColumnSchema } from "./column.validation.js";
import validateRequiredPermissions from "../../middlewares/permission.middleware.js";
import { projectParamSchema } from "../project/project.validation.js";

const router = express.Router({ mergeParams: true });

// GET /projects/:projectId/columns
router.get(
    "/columns",
    requireAuth,
    requireOrganizationAccess,
    validateRequiredPermissions(PERMISSIONS.TASK_READ),
    validate(projectParamSchema, "params"),
    requireProjectAccess,
    getColumnsController,
);

// POST /projects/:projectId/columns
router.post(
    "/columns",
    requireAuth,
    requireOrganizationAccess,
    validateRequiredPermissions(PERMISSIONS.TASK_EDIT),
    validate(projectParamSchema, "params"),
    validate(createColumnSchema, "body"),
    requireProjectAccess,
    createColumnController,
);

// PATCH /projects/:projectId/columns/:columnId
router.patch(
    "/columns/:columnId",
    requireAuth,
    requireOrganizationAccess,
    validateRequiredPermissions(PERMISSIONS.TASK_EDIT),
    validate(columnParamsSchema, "params"),
    // validate(updateColumnSchema, "body"),
    requireProjectAccess,
    updateColumnController,
);

// DELETE /projects/:projectId/columns/:columnId
router.delete(
    "/columns/:columnId",
    requireAuth,
    requireOrganizationAccess,
    validateRequiredPermissions(PERMISSIONS.TASK_DELETE),
    validate(columnParamsSchema, "params"),
    requireProjectAccess,
    deleteColumnController,
);

export default router;
