import asyncHandler from "./../../utils/async-handler.util.js";
import { successResponse } from "../../utils/api-response.util.js";
import HTTP_STATUS from "./../../constants/http-status.constant.js";
import {
  createProjectService,
  getAllProjectService,
  getProjectByIdService,
  updateProjectService,
  archiveProjectService,
  deleteProjectService,
  addProjectMemberService,
  removeProjectMemberService,
  removeAllProjectMembersService,
  getMembersForProjectService,
} from "./project.service.js";

// Controller to get all projects for a member
const getAllProjectsController = asyncHandler(async (req, res) => {
  const organizationId = req.params.orgId;
  const project = await getAllProjectService(
    organizationId,
    req.member,
    req.validatedQuery || {},
  );

  return successResponse(
    res,
    "Project fetched successfully",
    project,
    HTTP_STATUS.OK,
  );
});

// Controller to create a new project
const createProjectController = asyncHandler(async (req, res) => {
  const organizationId = req.params.orgId;
  const project = await createProjectService(
    req.user._id,
    req.member,
    req.body,
  );

  return successResponse(
    res,
    "Project created successfully",
    project,
    HTTP_STATUS.CREATED,
  );
});

// Controller to get a project by ID
const getProjectByIdController = asyncHandler(async (req, res) => {
  const { orgId, projectId } = req.params;
  console.log("project in service", req.project, req.projectMember);
  const project = await getProjectByIdService(orgId, projectId, req.member);

  return successResponse(
    res,
    "Project fetched successfully",
    project,
    HTTP_STATUS.OK,
  );
});

// Controller to update a project
const updateProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await updateProjectService(projectId, req.body);
  return successResponse(
    res,
    "Project updated successfully",
    project,
    HTTP_STATUS.OK,
  );
});

// Controller to archive a project
const archiveProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await archiveProjectService(projectId);
  return successResponse(
    res,
    "Project archived successfully",
    project,
    HTTP_STATUS.OK,
  );
});

// Controller to delete a project
const deleteProjectController = asyncHandler(async (req, res) => {
  console.log("deleted project controller");
  const { projectId } = req.params;
  console.log("Calling deleteProjectService");
  await deleteProjectService(projectId, req.user._id);
  return successResponse(
    res,
    "Project and related memberships deleted successfully",
    null,
    HTTP_STATUS.OK,
  );
});

const getMembersForProjectController = asyncHandler(async (req, res) => {
  const { orgId, projectId } = req.params;
  console.log("orgId, projectId", orgId, projectId);
  const members = await getMembersForProjectService(
    projectId,
    orgId,
    req.validatedQuery || {},
  );

  return successResponse(
    res,
    "Member fetched successfully",
    members,
    HTTP_STATUS.OK,
  );
});

const addProjectMemberController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId, roleId } = req.body;

  const member = await addProjectMemberService(
    projectId,
    memberId,
    roleId,
    req.user._id,
  );
  return successResponse(
    res,
    "Member added to project",
    member,
    HTTP_STATUS.CREATED,
  );
});

const removeProjectMemberController = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  await removeProjectMemberService(projectId, memberId, req.user._id);
  return successResponse(
    res,
    "Member removed from project",
    null,
    HTTP_STATUS.OK,
  );
});

const removeAllProjectMembersController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  await removeAllProjectMembersService(projectId, req.user._id);
  return successResponse(
    res,
    "All members removed from project",
    null,
    HTTP_STATUS.OK,
  );
});

export {
  getAllProjectsController,
  createProjectController,
  getProjectByIdController,
  updateProjectController,
  archiveProjectController,
  deleteProjectController,
  getMembersForProjectController,
  addProjectMemberController,
  removeProjectMemberController,
  removeAllProjectMembersController,
};
