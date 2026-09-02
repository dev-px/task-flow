import asyncHandler from "../../utils/async-handler.util.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";

const getColumnsController = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const columns = await getColumnsService(projectId);
    return successResponse(res, "Project columns fetched successfully.", columns, HTTP_STATUS.OK);
});

const createColumnController = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const column = await createColumnService(projectId, req.body);
    return successResponse(res, "Column created successfully.", column, HTTP_STATUS.CREATED);
});

const updateColumnController = asyncHandler(async (req, res) => {
    const { projectId, columnId } = req.params;
    const column = await updateColumnService(projectId, columnId, req.body);
    return successResponse(res, "Column updated successfully.", column, HTTP_STATUS.OK);
});

const deleteColumnController = asyncHandler(async (req, res) => {
    const { projectId, columnId } = req.params;
    await deleteColumnService(projectId, columnId, req.user._id);
    return successResponse(res, "Column deleted successfully.", null, HTTP_STATUS.OK);
});

export {
    getColumnsController,
    createColumnController,
    updateColumnController,
    deleteColumnController,
}