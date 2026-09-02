import mongoose from "mongoose";
import ApiError from "../../errors/ApiError.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { deleteAllSubtasksForTask } from "../subTask/subTask.repository.js";
import {
  countTasks,
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getAllTaskAssignees,
  deleteMemberFromTask,
  createTaskMemberRelation,
  checkMembersExistInProject,
  deleteAllTaskAssigneesForTask,
} from "./task.repository.js";

const getAllTasksService = async (projectId, query) => {
  try {
    const { search, assignee, priority, sortBy } = query;
    return await getAllTasks(projectId, search, assignee, priority, sortBy);
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to fetch task",
    );
  }
};

const getTaskByIdService = async (projectId, taskId) => {
  const task = await getTaskById(projectId, taskId);

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Task not found.");
  }

  return task;
};

const createTaskService = async (
  organizationId,
  projectId,
  userId,
  taskDetails,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { assignees = [], ...taskBody } = taskDetails;

    // 1. Create the task
    const task = await createTask(organizationId, projectId, taskBody, session);

    // 2. Validate and assign members if provided
    if (assignees.length > 0) {
      const allMembersValid = await checkMembersExistInProject(
        projectId,
        assignees,
        session,
      );

      if (!allMembersValid) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "One or more assignees do not belong to this project.",
        );
      }

      await createTaskMemberRelation(
        organizationId,
        projectId,
        task._id,
        userId,
        assignees,
        session,
      );
    }

    await session.commitTransaction();
    return task;
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    if (error?.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A duplicate record was detected.",
      );
    }

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create task.",
    );
  } finally {
    await session.endSession();
  }
};

const deleteTaskService = async (projectId, taskId, userId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Delete the main task
    const deletedTask = await deleteTask(projectId, taskId, userId, session);

    if (!deletedTask) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Task not found or already deleted.",
      );
    }

    // 2. Delete all related task assignments
    await deleteAllTaskAssigneesForTask(taskId, userId, session);

    // 3. Delete all related subtasks
    await deleteAllSubtasksForTask(taskId, userId, session);

    await session.commitTransaction();
    return deletedTask;
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    if (error instanceof ApiError) throw error;
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to delete task.",
    );
  } finally {
    await session.endSession();
  }
};

const getAllTaskAssigneeService = async (
  organizationId,
  projectId,
  taskId = null,
) => {
  try {
    return await getAllTaskAssignees(organizationId, projectId, taskId);
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to fetch task assignees.",
    );
  }
};

const addMemberToTaskService = async (
  organizationId,
  projectId,
  taskId,
  userId,
  memberIds,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Ensure the task actually exists first
    const task = await getTaskById(projectId, taskId);
    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Task not found.");
    }

    const assignedMembers = await createTaskMemberRelation(
      organizationId,
      projectId,
      taskId,
      userId,
      memberIds,
      session,
    );

    await session.commitTransaction();
    return assignedMembers;
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    if (error?.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "One or more members are already assigned to this task.",
      );
    }

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to assign members to task.",
    );
  } finally {
    await session.endSession();
  }
};

const deleteMemberService = async (projectId, taskId, memberId, userId) => {
  try {
    const removedAssignee = await deleteMemberFromTask(
      projectId,
      taskId,
      memberId,
      userId,
    );

    if (!removedAssignee) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Task assignment not found or already removed.",
      );
    }

    return removedAssignee;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to remove member from task.",
    );
  }
};

const getTotalTaskService = async (
  projectId,
  columnId = null,
  status = null,
) => {
  try {
    return await countTasksInColumn(projectId, columnId, status);
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to count tasks.",
    );
  }
};

export {
  getAllTasksService,
  getTaskByIdService,
  createTaskService,
  deleteTaskService,
  getAllTaskAssigneeService,
  addMemberToTaskService,
  deleteMemberService,
  getTotalTaskService,
};
