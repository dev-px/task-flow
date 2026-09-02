import mongoose from "mongoose";
import Column from "./column.schema.js";

// create column single and bulk
const createColumns = async (
  projectId,
  userId,
  columnDetails,
  session = null,
) => {
  const detailsWithMeta = columnDetails.map((col) => ({
    ...col,
    projectId,
    createdBy: userId,
  }));
  const [column] = await Column.insertMany(detailsWithMeta, { session });
  return column;
};

// get all column By order
const getAllColumnByOrder = async (projectId) => {
  const columns = await Column.find({
    projectId: new mongoose.Types.ObjectId(projectId),
    isDeleted: false,
  }).sort({ columnOrder: 1 });

  return columns;
};

// update column by id
const updateColumnById = async (projectId, columnId, updatedColumnDetails) => {
  const column = await Column.findOneAndUpdate(
    { _id: columnId, projectId, isDeleted: false },
    { $set: updatedColumnDetails },
    { new: true, lean: true },
  );

  return column;
};

// update column order for columnOrder
const bulkUpdateColumnReorder = async (
  projectId,
  updateColumnOrder,
  session = null,
) => {
  if (!updateColumnOrder?.length) return null;

  const bulkOperations = updateColumnOrder.map((col) => ({
    updateOne: {
      filter: {
        _id: col.columnId,
        projectId: projectId,
      },
      update: {
        $set: { columnOrder: col.columnOrder },
      },
    },
  }));

  return await Column.bulkWrite(bulkOperations, { session });
};

// delete columns
const deleteColumns = async (projectId, columnId, userId) => {
  const column = await Column.findOneAndUpdate(
    { _id: columnId, projectId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true, lean: true },
  );

  return column;
};



export {
  createColumns,
  getAllColumnByOrder,
  updateColumnById,
  bulkUpdateColumnReorder,
  deleteColumns,
};
