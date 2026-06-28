import { mongoose } from "mongoose";
import { createDefaultRolesForOrgService } from "../role/role.service.js";
import {
  createMemberForOrganization,
  getMemberByUserIdAndOrganizationId,
  getOrganizationsFromMember,
} from "../member/member.repository.js";
import {
  createOrganization,
  getOrganizationById,
  findActiveOrganizationBySlug,
  updateOrganization,
} from "./organization.repository.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";
import slugify from "../../utils/slug.util.js";
import { orgDeletionQueue } from "../../queues/orgDeletion.queue.js";

// check orgaization exist
const checkExistingOrganization = async (orgData) => {
  const potentialSlug = slugify(orgData.name);
  const existing = await findActiveOrganizationBySlug(potentialSlug);
  console.log("existing", existing);
  if (existing) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      `The workspace name '${orgData.name}' is already taken. Please choose a different name.`,
    );
  }
  return potentialSlug;
};

// view all organizations for a user
const viewAllOrganizationsService = async (
  userId,
  search,
  sortBy,
  isDeleted,
) => {
  const organizations = await getOrganizationsFromMember(
    userId,
    search,
    sortBy,
    isDeleted,
  );

  if (!organizations || organizations.length === 0) {
    return [];
  }

  const myOrganizations = organizations.map((membership) => ({
    organization: membership.organizationId,
    myRole: membership.roleId.name,
    myPermissions: membership.roleId.permissions,
  }));

  return myOrganizations;
};

// view particular organization details
const viewOrgDetailService = async (userId, organizationId) => {
  const organization = await getMemberByUserIdAndOrganizationId(
    userId,
    organizationId,
  );
  if (!organization) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Organization not found");
  }
  return organization;
};

// create organization, default roles and membership for the creator as owner
const createOrganizationService = async (orgData, userId) => {
  const potentialSlug = await checkExistingOrganization(orgData);

  // three things happens - Create Organization --> create default roles --> create membership for the creator as owner
  // To do this we use transaction session to ensure all three steps are successful or all rolled back if any step fails

  // Start the transaction
  const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    // check for limit acc to org plan
    // create organization
    const newOrganization = await createOrganization(
      { ...orgData, creatorId: userId, slug: potentialSlug },
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
        status: "active",
      },
      session,
    );

    // await session.commitTransaction();
    session.endSession();

    return { organization: newOrganization, member: newMember };
  } catch (error) {
    // await session.abortTransaction();
    session.endSession();

    // 2. Temporarily return the real error message to your API response:
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create organization. Please try again.",
    );
  }
};

// update name of the Organization
const updateOrganizationService = async (organizationId, updatedOrgData) => {
  console.log("checking in service for orgId", organizationId);
  // console.log(organizationId, userId, updatedOrgData)
  const organization = await updateOrganization(organizationId, updatedOrgData);

  if (!organization) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to update Organization Detail. Please try again.",
    );
  }

  return organization;
};

// delete the organization
const deleteOrgService = async (userId, organizationId) => {
  const organization = await viewOrgDetailService(organizationId);
  if (organization.isDeleted) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Organization is already being deleted.",
    );
  }

  // 1. Instantly setting status from "active" to "deleting"
  const delOrganization = await updateOrganization(organizationId, {
    deletionStatus: "deleting",
  });

  if (!delOrganization) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Organization's deletion failed.",
    );
  }

  // 2. all the heavy lifting to BullMQ
  await orgDeletionQueue.add("destroy-org-data", {
    organizationId,
    deletedBy: userId,
    originalSlug: organization.slug,
  });

  return { status: "deleting" };
};

export {
  viewAllOrganizationsService,
  viewOrgDetailService,
  createOrganizationService,
  updateOrganizationService,
  deleteOrgService,
};
