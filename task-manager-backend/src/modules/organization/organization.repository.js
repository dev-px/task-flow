import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";
import Organization from "./organization.schema.js";

const getOrganizationById = async (organizationId) => {
  const organization = Organization.findById(organizationId).lean();
  if (!organization) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Organization not found");
  }
  return organization;
};

const findOrganizationBySlug = async (slug) => {
  return Organization.findOne(slug).lean();
};

const getOrgByuserIdAndSlug = async (userId, potentialSlug) => {
  return await Organization.findOne({
    creatorId: userId,
    slug: potentialSlug,
  }).lean();
};

const createOrganization = async (orgData, session) => {
  const { slug, name } = orgData;
  const isSlugTaken = await findOrganizationBySlug(slug);
  if (isSlugTaken) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Slug is already taken. Please choose another one.",
    );
  }
  const [organization] = await Organization.create([orgData], { session });
  return organization;
};

const editOrganizationDetail = async (organizationId, updatedOrgData) => {
  const updatedOrgDetail = await Organization.findByIdAndUpdate(
    organizationId,
    { $set: updatedOrgData },
    { new: true, runValidators: true },
  );

  return updatedOrgDetail;
};

const updateGeneralInfoOrg = async (generalData, orgId) => {
  const updatedOrganization = await Organization.findByIdAndUpdate(
    orgId,
    { $set: generalData },
    { new: true, runValidators: true },
  );

  return updatedOrganization;
};

export {
  getOrganizationById,
  findOrganizationBySlug,
  createOrganization,
  editOrganizationDetail,
  updateGeneralInfoOrg,
  getOrgByuserIdAndSlug,
};
