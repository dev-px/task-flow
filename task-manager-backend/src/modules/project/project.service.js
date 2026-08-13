import mongoose from "mongoose";
import ApiError from "./../../errors/ApiError.js";
import redisClient from "./../../config/redis.config.js";
import HTTP_STATUS from "./../../constants/http-status.constant.js";
import {
  createProject,
  createProjectMember,
  getAllProjectByOrgIdUserId,
  getMembersForProject,
  getProjectByIdandMemberId,
  removeAllMembersFromProject,
  removeMemberFromProject,
  softDeleteProjectById,
  updateProjectById,
} from "./project.repository.js";

// Service function to clear all project member caches for a specific project
const clearAllProjectMemberCaches = async (projectId) => {
  let cursor = "0";
  do {
    const reply = await redisClient.scan(
      cursor,
      "MATCH",
      `project_member:${projectId}:*`,
      "COUNT",
      100,
    );
    cursor = reply[0];
    const keys = reply[1];
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } while (cursor !== "0");
};

const getAllProjectService = async (organizationId, memberData, filter) => {
  const memberId = memberData._id;
  console.log(organizationId, memberId);
  const projects = await getAllProjectByOrgIdUserId(
    organizationId,
    memberId,
    filter,
  );

  if (!projects) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No Project found");
  }

  return projects;
};

const createProjectService = async (userId, memberData, projectDetails) => {
  const { organizationId } = memberData;
  const payload = {
    ...projectDetails,
    organizationId: organizationId?._id,
  };
  console.log("payload checking", payload);
  const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const [newProject] = await createProject(payload, session);

    const projectMemberPayload = {
      projectId: newProject._id,
      memberId: memberData._id,
      roleId: memberData.roleId._id,
      assignedBy: userId,
    };

    // 3. Create the ProjectMember assignment
    createProjectMember(projectMemberPayload, session);

    // await session.commitTransaction();
    session.endSession();

    return newProject;
  } catch (error) {
    // await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A project with this name/slug already exists in your organization.",
      );
    }

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create Project. Please try again.",
    );
  }
};

const getProjectByIdService = async (organizationId, projectId, memberData) => {
  const project = await getProjectByIdandMemberId(projectId, memberData._id);
  if (!project) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No project found!");
  }
  return project;
};

// Service function to update a project
const updateProjectService = async (projectId, updateData) => {
  try {
    const updatedProject = await updateProjectById(projectId, updateData);

    if (!updatedProject) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found");
    }

    await redisClient.del(`project:${projectId}`);
    return updatedProject;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A project with this name already exists in your organization.",
      );
    }
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || "Failed to update Project. Please try again.",
    );
  }
};

// Service function to archive a project
const archiveProjectService = async (projectId) => {
  // Archiving simply sets status. We keep members intact so they can view historical data.
  const updatedProject = await updateProjectById(projectId, {
    status: "archived",
  });
  if (!updatedProject) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found");
  }

  await redisClient.del(`project:${projectId}`);
  return updatedProject;
};

// Service function to delete a project
const deleteProjectService = async (projectId, userId) => {
  const session = await mongoose.startSession();
  // session.startTransaction();

  console.log("deleted project service");
  try {
    // 1. Soft delete the project
    const deletedProject = await softDeleteProjectById(
      projectId,
      userId,
      session,
    );
    if (!deletedProject) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Project not found or already deleted",
      );
    }
    console.log("Project soft deleted successfully:", deletedProject);

    // 2. EDGE CASE: Soft delete all project members linked to this project
    await removeAllMembersFromProject(projectId, userId, session);

    // await session.commitTransaction();
    session.endSession();

    // 3. Invalidate caches
    await redisClient.del(`project:${projectId}`);
    console.log("Project cache cleared for project:", projectId);
    await clearAllProjectMemberCaches(projectId);
    console.log("All project member caches cleared for project:", projectId);

    return deletedProject;
  } catch (error) {
    // await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to delete project fully.",
    );
  }
};

const getMembersForProjectService = async (
  projectId,
  organizationId,
  query,
) => {
  // Implementation for fetching members for a project
  try {
    const { search, page, limit } = query;
    console.log(projectId, organizationId, search, page, limit);
    const member = await getMembersForProject(
      projectId,
      organizationId,
      search || "",
      page,
      limit,
    );

    return member;
  } catch {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to fetch members for the project.",
    );
  }
};

// Service function to add a member to a project
const addProjectMemberService = async (
  projectId,
  memberIdToAdd,
  roleId,
  currentUserId,
) => {
  const payload = {
    projectId,
    memberId: memberIdToAdd,
    roleId,
    assignedBy: currentUserId,
  };

  try {
    const [newMember] = await createProjectMember(payload);
    return newMember;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "This member is already assigned to the project.",
      );
    }
    throw error;
  }
};

// Service function to remove a member from a project
const removeProjectMemberService = async (
  projectId,
  memberIdToRemove,
  currentUserId,
) => {
  const removedMember = await removeMemberFromProject(
    projectId,
    memberIdToRemove,
    currentUserId,
  );

  if (!removedMember) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Member is not part of this project",
    );
  }

  // EDGE CASE: Invalidate the specific member's access cache instantly
  await redisClient.del(`project_member:${projectId}:${memberIdToRemove}`);
  return removedMember;
};

// Service function to remove all members from a project (mass member delete and cache invalidation)
const removeAllProjectMembersService = async (projectId, currentUserId) => {
  await removeAllMembersFromProject(projectId, currentUserId);

  await clearAllProjectMemberCaches(projectId);
  return true;
};

export {
  getAllProjectService,
  createProjectService,
  getProjectByIdService,
  clearAllProjectMemberCaches,
  updateProjectService,
  archiveProjectService,
  deleteProjectService,
  getMembersForProjectService,
  addProjectMemberService,
  removeProjectMemberService,
  removeAllProjectMembersService,
};
