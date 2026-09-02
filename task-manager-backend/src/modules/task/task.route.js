import express from "express";
import requireAuth from "./../../middlewares/auth.middleware.js";
import checkPlan from "../../middlewares/checkPlan.middleware.js";
import validate from "./../../middlewares/validation.middleware.js";
import requireProjectAccess from "./../../middlewares/project.middleware.js";
import validateRequiredPermissions from "../../middlewares/permission.middleware.js";
import requireOrganizationAccess from "./../../middlewares/organization.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.constant.js";
import {
  createTaskController,
  deleteMemberController,
  deleteTaskController,
  getAllTaskAssigneeController,
  getAllTasksController,
  getTaskByIdController,
  addMemberToTaskController
} from "./task.controller.js";
import {
  checkAllTaskSchema,
  createTaskSchema,
  getAllTaskQuerySchema,
} from "./task.validation.js";
import { projectParamSchema } from "../project/project.validation.js";

const router = express.Router({ mergeParams: true });
// get all task for a project - done
router.get(
  "/",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_READ),
  requireProjectAccess,
  validate(getAllTaskQuerySchema, "query"),
  getAllTasksController,
);

// get all assigned task for a user - done -- pass memberId -- in get all task for a project

// get particular task  - done
router.get(
  "/:taskId",
  requireAuth,
  validate(checkAllTaskSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_READ),
  requireProjectAccess,
  validate(getAllTaskQuerySchema, "query"),
  getTaskByIdController,
);

// create task - done
router.post(
  "/",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_CREATE),
  requireProjectAccess,
  checkPlan("tasks"),
  validate(createTaskSchema, "body"),
  createTaskController,
);

// update task details

// delete task  - memberId  - deleted person
router.delete(
  "/:taskId",
  requireAuth,
  validate(checkAllTaskSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_DELETE),
  requireProjectAccess,
  deleteTaskController,
);

// get all assignee for a task  - done
router.get(
  "/:taskId",
  requireAuth,
  validate(checkAllTaskSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_READ),
  requireProjectAccess,
  validate(getAllTaskQuerySchema, "query"),
  getAllTaskAssigneeController,
);

// add member to a task from project member schema --> add only member that is in projectMember schema - done
router.post(
  ":taskId/assignees",
  requireAuth,
  validate(projectParamSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_CREATE),
  requireProjectAccess,
  checkPlan("tasks"),
  validate(createTaskSchema, "body"),
  addMemberToTaskController,
);

// remove member to a task  - done
router.delete(
  "/:taskId/assignees",
  requireAuth,
  validate(checkAllTaskSchema, "params"),
  requireOrganizationAccess,
  validateRequiredPermissions(PERMISSIONS.TASK_DELETE),
  requireProjectAccess,
  deleteMemberController
);

// bulk delete task for when project is deleted -- all associated task with project mut deleted

export default router;
