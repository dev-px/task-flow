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
    isDeleted: false,
  })
    .select("projectId")
    .lean();

  const myProjectIds = assignments.map((a) => a.projectId);

  // Optimization: If they aren't assigned to any projects, return empty immediately!
  if (myProjectIds.length === 0) {
    return { projects: [], total: 0, page, limit };
  }

  const matchStage = {
    _id: { $in: myProjectIds },
    organizationId: new mongoose.Types.ObjectId(organizationId),
    isDeleted: false,
  };

  if (status) matchStage.status = status;

  if (search) {
    matchStage.$or = [
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
    { $match: matchStage },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const [result] = await Project.aggregate(pipeline);

  return {
    projects: result?.data || [],
    total: result?.metadata[0]?.total || 0,
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
  removeMemberFromProject,
  removeAllMembersFromProject,
};
