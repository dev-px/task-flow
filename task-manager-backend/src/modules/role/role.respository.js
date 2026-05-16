import mongoose from "mongoose";
import { Role } from "./role.schema.js";

const getRoleByOrgId = async (organizationId) => {
  return await Role.find({ organizationId, isArchived: false });
};

const getRoleById = async (roleId) => {
  return await Role.findById({ roleId, isArchived: false });
};

const getRoleByOrgIdAndSlug = async (organizationId) => {
  return await Role.findOne({
    organizationId,
    slug: potentialSlug,
    isArchived: false,
  });
};

const createManyRoles = async (roles) => {
  return await Role.insertMany(roles);
};

const createRole = async (roleData) => {
  return await Role.create(roleData);
};

const updateRoleByIdAndOrgId = async (roleId, orgId, updates) => {
  return await Role.findOneAndUpdate(
    { _id: roleId, organizationId: orgId },
    { $set: updates },
    { new: true, runValidators: true },
  );
};

const archiveRole = async (role, description) => {
  role.isArchived = true;
  role.archieveDescription = req.body.description;
  const archieveRoleData = await role.save();

  return archieveRoleData;
};

export {
  getRoleById,
  getRoleByOrgId,
  createManyRoles,
  getRoleByOrgIdAndSlug,
  updateRoleByIdAndOrgId,
};
