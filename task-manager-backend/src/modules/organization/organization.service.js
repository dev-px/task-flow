import { mongoose } from "mongoose";
import { createDefaultRolesForOrgService } from "../role/role.service.js";
import {
  createMemberForOrganization,
  getOrganizationsFromMember,
} from "../member/member.repository.js";
import {
  createOrganization,
  editOrganizationDetail,
  getOrganizationById,
  getOrgByuserIdAndSlug,
  updateGeneralInfoOrg,
} from "./organization.repository.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";
import slugify from "../../utils/slug.util.js";

// check orgaization exist
const checkExistingOrganization = async (userId, orgData) => {
  const potentialSlug = slugify(orgData.name);
  const existing = await getOrgByuserIdAndSlug(userId, potentialSlug);
  if (existing) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "An Organization with a similar name already exists.",
    );
  }
};

// view all organizations for a user
const viewAllOrganizationsService = async (userId) => {
  // user status must be active in the organization
  const organizations = await getOrganizationsFromMember(userId);

  if (!organizations || organizations.length === 0) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "No organizations found for the user.",
    );
  }
  const myOrganizations = organizations.map((membership) => ({
    organization: membership.organizationId,
    myRole: membership.roleId.name,
    myPermissions: membership.roleId.permissions,
  }));

  return myOrganizations;
};

// create organization, default roles and membership for the creator as owner
const createOrganizationService = async (orgData, userId) => {
  await checkExistingOrganization(userId, orgData);

  // three things happens - Create Organization --> create default roles --> create membership for the creator as owner
  // To do this we use transaction session to ensure all three steps are successful or all rolled back if any step fails

  // Start the transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // create organization
    const newOrganization = await createOrganization(
      { ...orgData, creatorId: userId },
      session,
    );
    if (!newOrganization) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create organization. Please try again.",
      );
    }

    // create defualt roles
    const defaultRole = await createDefaultRolesForOrgService(
      newOrganization._id,
      session,
    );
    const ownerRole = defaultRole.find((role) => role.name === "Owner");

    // Create Member Link
    const newMember = await createMemberForOrganization(
      {
        userId: userId,
        organizationId: newOrganization._id,
        roleId: ownerRole._id,
        status: "ACTIVE",
      },
      session,
    );

    await session.commitTransaction();
    session.endSession();

    return { organization: newOrganization, member: newMember };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create organization. Please try again.",
    );
  }
};

// update name of the Organization
const editOrganizationService = async (
  organizationId,
  userId,
  updatedOrgData,
) => {
  const existOrgData = await getOrganizationById(organizationId);
  if (!existOrgData) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Organization not found");
  }

  if (existOrgData?.name !== updatedOrgData.name) {
    await checkExistingOrganization(userId, existOrgData);
  }

  const organization = await editOrganizationDetail(
    organizationId,
    updatedOrgData,
  );
  if (!organization) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to update Organization Detail",
    );
  }
  return organization;
};

// update general info of the organization
const updateGeneralService = async (generalData, organizationId) => {
  const existOrgData = await getOrganizationById(organizationId);
  if (!existOrgData) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Organization not found");
  }

  const generalOrgInfo = await updateGeneralInfoOrg(
    generalData,
    organizationId,
  );
  if (!generalOrgInfo) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Organization's General info update failed.",
    );
  }

  return generalOrgInfo;
};

export {
  viewAllOrganizationsService,
  createOrganizationService,
  updateGeneralService,
  editOrganizationService,
};
