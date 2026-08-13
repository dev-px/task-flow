import mongoose from "mongoose";
import Project from "./project.schema.js";
import Member from "../member/member.schema.js";
import ProjectMember from "./projectMember.schema.js";

// Get Project by ID
const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId).lean();
  return project;
};

// Get all projects for a specific organization and member
const getAllProjectByOrgIdUserId = async (
  organizationId,
  memberId,
  queryParams,
) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const { search, status, sortBy } = queryParams;

  // Query the junction collection to get just the IDs this member has access to
  const assignments = await ProjectMember.find({
    memberId: memberId,
    // isDeleted: false,
  })
    .select("projectId")
    .lean();

  const myProjectIds = assignments.map((a) => a.projectId);

  // Optimization: If they aren't assigned to any projects, return empty immediately!
  if (myProjectIds.length === 0) {
    return {
      projects: [],
      total: 0,
      totalAssigned: 0,
      deletedCount: 0,
      statusCounts: {},
      page,
      limit,
    };
  }

  // Global scope for this user: Includes deleted projects so we can count them!
  const baseMatchStage = {
    _id: { $in: myProjectIds },
    organizationId: new mongoose.Types.ObjectId(organizationId),
  };

  // Filter stage for active pagination data (strictly non-deleted items)
  const filterMatchStage = {
    ...baseMatchStage,
    isDeleted: { $ne: true },
  };

  if (status) filterMatchStage.status = status;
  if (search) {
    filterMatchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
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

  const pipeline = [
    { $match: baseMatchStage }, // Bring all assigned user projects into the pipeline
    {
      $facet: {
        // Facet 1: Paginated data (Non-deleted + Search Filtered)
        data: [
          { $match: filterMatchStage },
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit },
        ],
        // Facet 2: Total records matching current search/status filters (Non-deleted)
        filteredTotal: [{ $match: filterMatchStage }, { $count: "count" }],
        // Facet 3: Count of every status group (Non-deleted)
        statusCounts: [
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
        // Facet 4: Absolute total of assigned projects (Includes deleted)
        globalTotal: [{ $count: "count" }],
        // Facet 5: Count of deleted projects
        deletedCounts: [{ $match: { isDeleted: true } }, { $count: "count" }],
      },
    },
  ];

  const [result] = await Project.aggregate(pipeline);

  // Transform status counts array to object { active: 5, pending: 2 }
  const formattedStatusCounts = {};
  if (result?.statusCounts) {
    result.statusCounts.forEach((item) => {
      if (item._id) formattedStatusCounts[item._id] = item.count;
    });
  }

  return {
    projects: result?.data || [],
    totalFiltered: result?.filteredTotal[0]?.count || 0, // Total matches for current grid view
    totalAssigned: result?.globalTotal[0]?.count || 0, // Grand total of all unique projects assigned
    deletedCount: result?.deletedCounts[0]?.count || 0, // Count of deleted projects
    statusCounts: formattedStatusCounts,
    page: page,
    limit: limit,
  };
};

// Create a new Project
const createProject = async (projectDetails, session) => {
  console.log("projectDetails", projectDetails);
  const [newProject] = await Project.create([projectDetails], { session });
  return [newProject];
};

// Create a new ProjectMember assignment
const createProjectMember = async (projectMemberPayload, session) => {
  const [projectMember] = await ProjectMember.create([projectMemberPayload], {
    session,
  });
  return [projectMember];
};

// Get Project by ID and Member ID
const getProjectByIdandMemberId = async (projectId, memberId) => {
  const projectResult = await ProjectMember.find({
    projectId,
    memberId,
  }).populate("projectId roleId");
  return projectResult;
};

// Update Project
const updateProjectById = async (projectId, updatePayload) => {
  return await Project.findByIdAndUpdate(
    projectId,
    { $set: updatePayload },
    { new: true, runValidators: true },
  ).lean();
};

// Soft Delete Project
const softDeleteProjectById = async (projectId, userId, session) => {
  return await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true, session },
  ).lean();
};

// Get all members
const getMembersForProject = async (
  projectId,
  organizationId,
  searchTerm = "",
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    // 1. Filter active members for this organization
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        isDeleted: false,
        status: "active",
      },
    },

    // 2. Join User schema to get name and email
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: "$userData",
    },
  ];

  // 3. Optional Search Filter
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { "userData.name": { $regex: searchTerm, $options: "i" } },
          { "userData.email": { $regex: searchTerm, $options: "i" } },
        ],
      },
    });
  }

  // 4. Check if they are assigned to THIS project
  pipeline.push(
    {
      $lookup: {
        from: "projectmembers",
        let: { current_member_id: "$_id" }, // _id from the Member schema
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // Compare ProjectMember's memberId to the Member's _id
                  { $eq: ["$memberId", "$$current_member_id"] },
                  {
                    $eq: ["$projectId", new mongoose.Types.ObjectId(projectId)],
                  },
                  { $eq: ["$isDeleted", false] },
                ],
              },
            },
          },
        ],
        as: "projectAssignment",
      },
    },

    // 5. Add a boolean flag based on the lookup result
    {
      $addFields: {
        isAssignedToProject: {
          $gt: [{ $size: "$projectAssignment" }, 0],
        },
      },
    },

    // 6. MAP AND FLATTEN the response payload for the frontend
    {
      $project: {
        _id: 1, // Member _id
        userId: 1,
        name: "$userData.name",
        email: "$userData.email",
        isAssignedToProject: 1,
      },
    },

    // 7. Pagination
    { $skip: skip },
    { $limit: limit },
  );

  // 8. Execute and return
  const members = await Member.aggregate(pipeline);
  console.log("members", members);
  return members;
};

// Remove a single member
const removeMemberFromProject = async (projectId, memberId, userId) => {
  return await ProjectMember.findOneAndUpdate(
    { projectId, memberId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true },
  ).lean();
};

// Remove ALL members (Edge case for project deletion)
const removeAllMembersFromProject = async (projectId, userId, session) => {
  return await ProjectMember.updateMany(
    { projectId, isDeleted: false },
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
  getProjectById,
  getAllProjectByOrgIdUserId,
  createProject,
  createProjectMember,
  getProjectByIdandMemberId,
  updateProjectById,
  softDeleteProjectById,
  getMembersForProject,
  removeMemberFromProject,
  removeAllMembersFromProject,
};
