import mongoose from "mongoose";
import Role from "./role.schema.js";

const getRoleByOrgId = async (query, sortQuery, session = null) => {
  return await Role.find(query).sort(sortQuery).session(session).lean();
};

const getRoleById = async (roleId) => {
  return await Role.findById({ _id: roleId, isDeleted: false });
};

const getRoleByOrgIdAndSlug = async (organizationId, slug) => {
  return await Role.findOne({
    organizationId,
    slug,
    isDeleted: false,
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

const archiveRole = async (role, description, userId) => {
  role.isDeleted = true;
  role.deleteDescription = description;
  role.deletedAt = new Date();
  role.deletedBy = userId;
  const archieveRoleData = await role.save();

  return archieveRoleData;
};

export {
  getRoleById,
  getRoleByOrgId,
  createManyRoles,
  createRole,
  getRoleByOrgIdAndSlug,
  updateRoleByIdAndOrgId,
  archiveRole
};
