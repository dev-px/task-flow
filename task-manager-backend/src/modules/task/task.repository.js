import mongoose from "mongoose";
import Task from "./task.schema.js";
import TaskAssignee from "./taskAssignee.schema.js";
import ProjectMember from "./../project/projectMember.schema.js";

// get all tasks for a project
const getAllTasks = async (projectId, search, assignee, priority, sortBy) => {
  const baseMatchStage = {
    projectId: new mongoose.Types.ObjectId(projectId),
    isDeleted: false,
  };

  if (assignee) {
    const taskAssignees = await TaskAssignee.find({
      projectId,
      memberId: assignee,
      isDeleted: false,
    }).select("taskId");

    if (taskAssignees.length > 0) {
      baseMatchStage._id = { $in: taskAssignees.map((task) => task.taskId) };
    } else {
      return [];
    }
  }

  if (search) {
    baseMatchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (priority) {
    baseMatchStage.priority = priority;
  }

  let sortStage = { createdAt: -1 };
  switch (sortBy) {
    case "oldest":
      sortStage = { createdAt: 1 };
      break;
    case "title-asc":
      sortStage = { title: 1 };
      break;
    case "title-desc":
      sortStage = { title: -1 };
      break;
    case "newest":
    default:
      sortStage = { createdAt: -1 };
      break;
  }

  return await Task.aggregate([
    { $match: baseMatchStage },
    { $sort: sortStage },
  ]);
};

// get all assignee for the whole task or for a specific task
const getAllTaskAssignees = async (
  organizationId,
  projectId,
  taskId = null,
) => {
  const pipeline = [
    // 1. Get only members that are assigned to THIS project
    {
      $match: {
        projectId: new mongoose.Types.ObjectId(projectId),
        isDeleted: false,
      },
    },

    // 2. Join Member schema to ensure they belong to the organization and are active
    {
      $lookup: {
        from: "members", // Name of your Member collection in MongoDB (usually plural lowercase)
        localField: "memberId",
        foreignField: "_id",
        as: "memberData",
      },
    },
    {
      $unwind: "$memberData",
    },
    {
      $match: {
        "memberData.organizationId": new mongoose.Types.ObjectId(
          organizationId,
        ),
        "memberData.isDeleted": false,
        "memberData.status": "active",
      },
    },

    // 3. Join User schema to get the actual name and email
    {
      $lookup: {
        from: "users", // Name of your User collection
        localField: "memberData.userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: "$userData",
    },

    // 4. (Optional) If taskId is provided, check if they are already assigned to THIS task
    {
      $lookup: {
        from: "taskassignees",
        let: { current_member_id: "$memberId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$memberId", "$$current_member_id"] },
                  { $eq: ["$isDeleted", false] },
                  ...(taskId
                    ? [
                        {
                          $eq: ["$taskId", new mongoose.Types.ObjectId(taskId)],
                        },
                      ]
                    : []),
                ],
              },
            },
          },
        ],
        as: "taskAssignments",
      },
    },

    // 5. Add a boolean flag based on the lookup result
    {
      $addFields: {
        // Renamed flag to make more sense: they are ALL in the project now,
        // this checks if they are assigned to the specific task.
        isAssignedToTask: {
          $gt: [{ $size: "$taskAssignments" }, 0],
        },
      },
    },

    // 6. Clean up response payload for frontend consumption
    {
      $project: {
        _id: "$memberId", // Returning the memberId as the primary _id for the frontend
        userId: "$memberData.userId",
        name: "$userData.name",
        email: "$userData.email",
        roleId: 1, // Optional: You have roleId in ProjectMember, might be useful for UI
        isAssignedToTask: 1,
      },
    },
  ];

  // Execute aggregation on ProjectMember, NOT Member
  const taskAssignees = await ProjectMember.aggregate(pipeline);
  return taskAssignees;
};

// get task by Id
const getTaskById = async (projectId, taskId) => {
  const task = await Task.findOne({ _id: taskId, projectId, isDeleted: false });
  return task;
};

// create new task
const createTask = async (
  organizationId,
  projectId,
  taskBody,
  session = null,
) => {
  const [task] = await Task.create(
    [{ ...taskBody, projectId, organizationId }],
    { session },
  );
  return task;
};

// create task member relation (or add member to a task)
const createTaskMemberRelation = async (
  organizationId,
  projectId,
  taskId,
  userId,
  memberIds,
  session = null,
) => {
  if (!memberIds || memberIds.length === 0) return [];

  const bulkOperations = memberIds.map((memberId) => ({
    updateOne: {
      filter: {
        taskId: new mongoose.Types.ObjectId(taskId),
        memberId: new mongoose.Types.ObjectId(memberId),
      },
      update: {
        $set: {
          projectId,
          organizationId,
          assignedBy: userId,
          assignedAt: new Date(),
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
        },
      },
      upsert: true, // Creates the document if it doesn't exist
    },
  }));

  console.log("bulkOperations in task repo", bulkOperations);

  // Execute all operations safely
  return await TaskAssignee.bulkWrite(bulkOperations, { session });
};

// single member delete from task
const deleteMemberFromTask = async (projectId, taskId, memberId, userId) => {
  return await TaskAssignee.findOneAndUpdate(
    { projectId, taskId, memberId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true, runValidators: true, lean: true },
  );
};

// delete all memeber from task
const deleteAllTaskAssigneesForTask = async (
  taskId,
  userId,
  session = null,
) => {
  return await TaskAssignee.updateMany(
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

// count number of task
const countTasks = async (projectId, columnId = null, status = null) => {
  const query = {
    projectId,
    isDeleted: false,
  };

  if (columnId) query.columnId = columnId;
  if (status) query.status = status;

  return await Task.countDocuments(query);
};

const checkMembersExistInProject = async (
  projectId,
  memberIds,
  session = null,
) => {
  const count = await ProjectMember.countDocuments(
    { projectId, memberId: { $in: memberIds }, isDeleted: false },
    { session },
  );
  return count === memberIds.length;
};

const deleteTask = async (projectId, taskId, session) => {
  const task = await Task.findOneAndUpdate(
    { projectId, _id: taskId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true, runValidators: true, lean: true, session: session },
  );
};

export {
  getAllTasks,
  getAllTaskAssignees,
  getTaskById,
  createTask,
  createTaskMemberRelation,
  deleteMemberFromTask,
  deleteAllTaskAssigneesForTask,
  countTasks,
  checkMembersExistInProject,
  deleteTask,
};
