import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  getAllTaskAssigneeService,
  addMemberToTaskService,
  deleteMemberService,
  getTotalTaskService,
} from "./task.service.js";

// Get all tasks for a project
const getAllTasksController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const tasks = await getAllTasksService(projectId, req.query);

  return successResponse(
    res,
    "Tasks fetched successfully",
    tasks,
    HTTP_STATUS.OK,
  );
});

// Get a single task by ID
const getTaskByIdController = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await getTaskByIdService(projectId, taskId);

  return successResponse(
    res,
    "Task fetched successfully",
    task,
    HTTP_STATUS.OK,
  );
});

// Create a new task
const createTaskController = asyncHandler(async (req, res) => {
  const { orgId, projectId } = req.params;
  const userId = req.user.id;

  const task = await createTaskService(orgId, projectId, userId, req.body);

  return successResponse(
    res,
    "Task created successfully",
    task,
    HTTP_STATUS.CREATED,
  );
});

const updateTaskController = asyncHandler(async (req, res) => {});

// delete task
const deleteTaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const userId = req.user.id;

  await deleteTaskService(projectId, taskId, userId);

  return successResponse(
    res,
    "Task and all associated data deleted successfully",
    null,
    HTTP_STATUS.OK,
  );
});

// Get all assignees for a project
const getAllTaskAssigneeController = asyncHandler(async (req, res) => {
  const { orgId, projectId } = req.params;
  const { taskId } = req.query; // Optional filter from query params

  const assignees = await getAllTaskAssigneeService(orgId, projectId, taskId);

  return successResponse(
    res,
    "Task assignees fetched successfully",
    assignees,
    HTTP_STATUS.OK,
  );
});

// Add members to a task
const addMemberToTaskController = asyncHandler(async (req, res) => {
  const { orgId, projectId, taskId } = req.params;
  const { memberIds } = req.body;
  const userId = req.user.id;

  const assignedMembers = await addMemberToTaskService(
    orgId,
    projectId,
    taskId,
    userId,
    memberIds,
  );

  return successResponse(
    res,
    "Members assigned to task successfully",
    assignedMembers,
    HTTP_STATUS.OK,
  );
});

// Remove a member from a task
const deleteMemberController = asyncHandler(async (req, res) => {
  const { projectId, taskId, memberId } = req.params;
  const userId = req.user.id;

  const removedAssignee = await deleteMemberService(
    projectId,
    taskId,
    memberId,
    userId,
  );

  return successResponse(
    res,
    "Member removed from task successfully",
    removedAssignee,
    HTTP_STATUS.OK,
  );
});

// Get total count of tasks
const getTotalTaskController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { columnId, status } = req.query; // Optional filters

  const totalTasks = await getTotalTaskService(projectId, columnId, status);

  return successResponse(
    res,
    "Total tasks counted successfully",
    { count: totalTasks },
    HTTP_STATUS.OK,
  );
});

export {
  getAllTasksController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getAllTaskAssigneeController,
  addMemberToTaskController,
  deleteMemberController,
  getTotalTaskController,
};
