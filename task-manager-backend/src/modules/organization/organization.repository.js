import HTTP_STATUS from "../../constants/http-status.constant.js";
import ApiError from "../../errors/ApiError.js";
import Organization from "./organization.schema.js";

const getOrganizationById = async (organizationId) => {
  // console.log("checking in org repo", organizationId);
  const organization = await Organization.findById(organizationId).populate("roleId").lean();
  if (!organization) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Organization not found");
  }
  return organization;
};

const findOrganizationBySlug = async (slug) => {
  return await Organization.findOne(slug).lean();
};

const findActiveOrganizationBySlug = async (potentialSlug) => {
  return await Organization.findOne({
    slug: potentialSlug,
    isDeleted: false,
  }).lean();
};

const createOrganization = async (orgData, session) => {
  const [organization] = await Organization.create([orgData], { session });
  return organization;
};

const updateOrganization = async (organizationId, updateData) => {
  return await Organization.findByIdAndUpdate(
    organizationId,
    { $set: updateData },
    { returnDocument: "after", runValidators: true },
  );
};

export {
  getOrganizationById,
  findOrganizationBySlug,
  createOrganization,
  findActiveOrganizationBySlug,
  updateOrganization,
};
