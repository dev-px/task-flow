import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import HTTP_STATUS from "./../../constants/http-status.constant.js";
import {
  createOrganizationService,
  deleteOrgService,
  editOrganizationService,
  updateGeneralService,
  viewAllOrganizationsService,
  viewOrgDetailService,
} from "./organization.service.js";

const viewAllOrganizationsController = asyncHandler(async (req, res) => {
  const { isDeleted } = req.validatedQuery || false;
  console.log(req.validatedQuery.isDeleted, req, "middleware");
  const organizations = await viewAllOrganizationsService(
    req.user.id,
    isDeleted,
  );
  return successResponse(
    res,
    "Organization fetched successfully",
    organizations,
    HTTP_STATUS.OK,
  );
});

const viewOrgDetailController = asyncHandler(async (req, res) => {
  const organizations = await viewOrgDetailService(
    req.user.id,
    req.params.orgId,
  );
  return successResponse(
    res,
    "Organization fetched successfully",
    organizations,
    HTTP_STATUS.OK,
  );
});

const createOrganizationController = asyncHandler(async (req, res) => {
  const { organization, member } = await createOrganizationService(
    req.body,
    req.user.id,
  );

  return successResponse(
    res,
    "Organization created successfully",
    { organization, member },
    HTTP_STATUS.CREATED,
  );
});

const editOrganizationController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const organization = await editOrganizationService(
    req.user.id,
    orgId,
    req.body,
  );

  return successResponse(
    res,
    "Organization name updated successfully",
    organization,
    HTTP_STATUS.CREATED,
  );
});

const updateGeneralController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const generalOrgInfo = await updateGeneralService(orgId, req.body);
  return successResponse(
    res,
    "Organization info updated successfully",
    generalOrgInfo,
    HTTP_STATUS.OK,
  );
});

const deleteOrgController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const generalOrgInfo = await deleteOrgService(req.user.id, orgId);
  return successResponse(
    res,
    "Organization deletion is processing in the background.",
    generalOrgInfo,
    HTTP_STATUS.ACCEPTED,
  );
});

export {
  viewAllOrganizationsController,
  viewOrgDetailController,
  createOrganizationController,
  updateGeneralController,
  editOrganizationController,
  deleteOrgController,
};
