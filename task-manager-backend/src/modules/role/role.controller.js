import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import {
  archieveRoleService,
  createDefaultRolesForOrgService,
  createNewRoleService,
  editRoleService,
  getAllRolesService,
} from "./role.service.js";

const getAllRolesController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const roles = await getAllRolesService(orgId);
  return successResponse(
    res,
    "Roles fetched successfully",
    roles,
    HTTP_STATUS.OK,
  );
});

const createNewRoleController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const role = await createNewRoleService(orgId, req.body);
  return successResponse(
    res,
    "Role created successfully",
    role,
    HTTP_STATUS.CREATED,
  );
});

const editRoleController = asyncHandler(async (req, res) => {
  const { orgId, roleId } = req.params;
  const updates = req.body;
  const updatedRole = await editRoleService(orgId, roleId, updates);

  return successResponse(
    res,
    "Role updated successfully",
    updatedRole,
    HTTP_STATUS.OK,
  );
});

const archiveRoleController = async (req, res) => {
  const { roleId } = req.params;
  const archivedRole = await archieveRoleService(roleId);
  return successResponse(
    res,
    "Role archived successfully",
    archivedRole,
    HTTP_STATUS.OK,
  );
};

export {
  getAllRolesController,
  createNewRoleController,
  editRoleController,
  archiveRoleController,
};
