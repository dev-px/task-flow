import mongoose from "mongoose";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";

const getColumnsService = (projectId) => getAllColumns(projectId);

const createColumnService = async (projectId, body) => {
    const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const column = await createColumn(projectId, body, session);
        return column;

        // await session.abortTransaction();
    } catch (error) {
        // await session.abortTransaction();
        if (error?.code === 11000) throw new ApiError(HTTP_STATUS.CONFLICT, "A column with the same order already exists.");
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create column.");
    } finally {
        session.endSession();
    }
};

const updateColumnService = async (projectId, columnId, body) => {
    const existing = await getColumnById(projectId, columnId);
    if (!existing) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Column not found.");
    const updated = await updateColumnById(projectId, columnId, body);
    if (!updated) throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update column.");
    return updated;
};

const deleteColumnService = async (projectId, columnId, userId) => {
    const deleted = await softDeleteColumnById(projectId, columnId, userId);
    if (!deleted) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Column not found or already deleted.");
    await redisClient.del(`project:${projectId}:columns`);
    return deleted;
};


export {
    getColumnsService,
    createColumnService,
    updateColumnService,
    deleteColumnService,
}