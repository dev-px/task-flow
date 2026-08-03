import ApiError from "../errors/ApiError.js";
import redisClient from "./../config/redis.config.js";
import Project from "../modules/project/project.schema.js";
import HTTP_STATUS from "../constants/http-status.constant.js";
import ProjectMember from "../modules/project/projectMember.schema.js";
import { getProjectById } from "../modules/project/project.repository.js";

const requireProjectAccess = async (req, res, next) => {
  try {
    const { projectId, orgId } = req.params;
    const memberId = req.member._id.toString();

    const projectCacheKey = `project:${projectId}`;
    let project;
    const cachedProject = await redisClient.get(projectCacheKey);

    if (cachedProject) {
      project = JSON.parse(cachedProject);
    } else {
      project = await getProjectById(projectId);
      // Only cache if the project actually exists in the DB
      if (project) {
        await redisClient.setex(projectCacheKey, 3600, JSON.stringify(project));
      }
    }

    // Global existence and soft-delete check (Protects against stale cache)
    if (!project || project.isDeleted) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found."));
    }

    // Organization Boundary Check
    if (project.organizationId.toString() !== orgId) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Project does not belong to this organization.",
        ),
      );
    }

    // Archived State Check
    if (project.status === "archived" && req.method !== "GET") {
      const isUnarchiveRequest = req.originalUrl.includes("/unarchive");
      const isDeleteRequest = req.method === "DELETE";

      // If they are NOT trying to unarchive, and NOT trying to delete, block the request.
      if (!isUnarchiveRequest && !isDeleteRequest) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "This project is archived and is currently read-only. You cannot modify its details or tasks.",
          ),
        );
      }
    }

    req.project = project;

    // Allows Org Owner to see all projects
    if (req.member.role === "owner") {
      return next();
    }

    const projectMemberCacheKey = `project_member:${projectId}:${memberId}`;
    let projectAssignment;
    const cachedAssignment = await redisClient.get(projectMemberCacheKey);

    if (cachedAssignment) {
      projectAssignment = JSON.parse(cachedAssignment);
    } else {
      projectAssignment = await ProjectMember.findOne({
        projectId,
        memberId,
        isDeleted: false,
      }).lean();

      if (projectAssignment) {
        await redisClient.setex(
          projectMemberCacheKey,
          3600,
          JSON.stringify(projectAssignment),
        );
      }
    }

    // Global assignment and soft-delete check (Protects against stale cache)
    if (!projectAssignment || projectAssignment.isDeleted) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have access to this project.",
        ),
      );
    }

    req.projectAssignment = projectAssignment;
    return next();
  } catch (error) {
    next(error);
  }
};

export default requireProjectAccess;
