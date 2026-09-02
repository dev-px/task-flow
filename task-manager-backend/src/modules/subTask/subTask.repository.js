
// count number of subtask
const countSubTasks = async (taskId) =>
  SubTask.countDocuments({ taskId, isDeleted: false });

// get all subtasks
const getSubTasks = async (taskId) =>
  SubTask.find({ taskId, isDeleted: false }).sort({ createdAt: -1 }).lean();

// get subtask by Id
const getSubTaskById = async (taskId, subTaskId) =>
  SubTask.findOne({ taskId, _id: subTaskId, isDeleted: false }).lean();

// create new subtask
const createSubTask = async (taskId, body) => {
  const [subTask] = await SubTask.create([{ ...body, taskId }]);
  return subTask.toObject();
};

// update details of subtask
const updateSubTask = async (taskId, subTaskId, updates) =>
  SubTask.findOneAndUpdate(
    { taskId, _id: subTaskId, isDeleted: false },
    { $set: updates },
    { new: true, runValidators: true, lean: true },
  );

// delete one subtask
const deleteSubTask = async (taskId, subTaskId, deletedBy) => {
  return await SubTask.findOneAndUpdate(
    { taskId, _id: subTaskId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date(), deletedBy } },
    { new: true, lean: true },
  );
};

const deleteAllSubtasksForTask = async (taskId, userId, session = null) => {
  return await Subtask.updateMany(
    { taskId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { session },
  );
};

export {
  countSubTasks,
  getSubTasks,
  getSubTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  deleteAllSubtasksForTask,
};
