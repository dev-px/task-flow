import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import HTTP_STATUS from "./../../constants/http-status.constant.js";
import {
  createOrganizationService,
  editOrganizationService,
  updateGeneralService,
  viewAllOrganizationsService,
} from "./organization.service.js";

const viewAllOrganizationsController = asyncHandler(async (req, res) => {
  const organizations = await viewAllOrganizationsService(req.user.id);
  return successResponse(
    res,
    "Organization fetched successfully",
    organizations,
    HTTP_STATUS.CREATED,
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
    orgId,
    req.user.id,
    req.body,
  );

  return successResponse(
    res,
    "Organization updated successfully",
    { organization, member },
    HTTP_STATUS.CREATED,
  );
});

const updateGeneralController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const generalOrgInfo = await updateGeneralService(req.body, orgId);
  return successResponse(
    res,
    "Organization general info updated successfully",
    generalOrgInfo,
    HTTP_STATUS.OK,
  );
});

export {
  viewAllOrganizationsController,
  createOrganizationController,
  updateGeneralController,
  editOrganizationController,
};
