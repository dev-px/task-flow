import ApiError from "../../errors/ApiError.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import {
  createSubTask,
  deleteSubTask,
  getSubTaskById,
  getSubTasks,
} from "./subTask.repository.js";

const getSubTaskService = async () => {
  try {
    const subTasks = await getSubTasks(taskId);
    return subTasks;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Something Went Wrong. Please try again...!",
    );
  }
};

const getSubTaskByIdService = async (taskId, subTaskId) => {
  try {
    const subTask = await getSubTaskById(taskId, subTaskId);
    return subTask;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Something Went Wrong. Please try again...!",
    );
  }
};

const createSubTaskService = async (taskId, subTaskDetails) => {
  try {
    const subTask = await createSubTask(taskId, subTaskDetails);
    return subTask;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Something Went Wrong. Please try again...!",
    );
  }
};

const deleteSubTaskService = async (taskId, subTaskId, userId) => {
  try {
    const deleted = await deleteSubTask(taskId, subTaskId, userId);
    return deleted;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Something Went Wrong. Please try again...!",
    );
  }
};

const updateSubTaskService = async (projectId, taskId, subTaskId, body) => {
  //   const existing = await getSubTask(projectId, taskId, subTaskId);
  //   const effectiveStart =
  //     body.startDate === undefined ? existing.startDate : body.startDate;
  //   const effectiveDue =
  //     body.dueDate === undefined ? existing.dueDate : body.dueDate;
  //   if (
  //     effectiveStart &&
  //     effectiveDue &&
  //     new Date(effectiveDue) < new Date(effectiveStart)
  //   ) {
  //     throw fail(
  //       HTTP_STATUS.BAD_REQUEST,
  //       "INVALID_DATE_RANGE",
  //       "Subtask due date cannot be earlier than its start date.",
  //     );
  //   }

  try {
    const updated = await taskRepository.updateSubTask(taskId, subTaskId, body);
    return updated;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Something Went Wrong. Please try again...!",
    );
  }
};

export {
  getSubTaskService,
  getSubTaskByIdService,
  createSubTaskService,
  updateSubTaskService,
  deleteSubTaskService,
};
