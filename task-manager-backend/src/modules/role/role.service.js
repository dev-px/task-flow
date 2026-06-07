import logger from "../../config/logger.config.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import {
  ALL_PERMISSIONS,
  PERMISSIONS,
} from "../../constants/permissions.constant.js";
import fnDefaultRoleCreation from "../../constants/roles.constant.js";
import ApiError from "../../errors/ApiError.js";
import invalidateRoleCache from "../../helpers/redis-cache.helper.js";
import slugify from "../../utils/slug.util.js";
import {
  createManyRoles,
  getRoleById,
  getRoleByOrgId,
  getRoleByOrgIdAndSlug,
  updateRoleByIdAndOrgId,
} from "./role.respository.js";
import Role from "./role.schema.js";

const checkExistingRole = async (organizationId, roleData) => {
  const potentialSlug = slugify(roleData.name);
  const existing = await getRoleByOrgIdAndSlug(organizationId, potentialSlug);
  if (existing) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "A role with a similar name already exists.",
    );
  }
};

const getAllRolesService = async (organizationId) => {
  const roles = await getRoleByOrgId(organizationId);
  if (!roles) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No roles found");
  }
  return roles;
};

const createDefaultRolesForOrgService = async (organizationId, session) => {
  const defaultRoles = fnDefaultRoleCreation(organizationId);
  const operations = defaultRoles.map((role) => {
    return {
      updateOne: {
        filter: {
          organizationId: organizationId,
          slug: slugify(role.name),
        },
        update: {
          $set: {
            name: role.name,
            slug: slugify(role.name), // Manually inject the slug here
            description: role.description,
            permissions: role.permissions,
            isSystemDefault: role.isSystemDefault ?? true,
          },
        },
        upsert: true,
      },
    };
  });
  console.log("operations", operations);

  await Role.bulkWrite(operations, { session });

  // Fetch and return the finalized array of roles assigned to this tenant
  const finalRoles = await getRoleByOrgId(organizationId, session);
  console.log("finalRoles", finalRoles);
  if (!finalRoles || finalRoles.length !== defaultRoles.length) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to provision workspace security profiles.",
    );
  }

  return finalRoles;
};

const createNewRoleService = async (organizationId, roleData) => {
  await checkExistingRole(organizationId, roleData);

  const role = createNewRole({ ...roleData, organizationId: organizationId });
  if (!role) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to create role. Please try again",
    );
  }
  return role;
};

const editRoleService = async (orgId, roleId, updates) => {
  const currentRole = await getRoleById(roleId);
  if (!currentRole) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found");
  }

  if (currentRole.isSystemDefault && updates.name) {
    if (updates.name.trim().toLowerCase() !== currentRole.name.toLowerCase()) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "System roles cannot be renamed",
      );
    }
  }

  if (updates.name && updates.name.trim() !== currentRole.name) {
    await checkExistingRole(orgId, updates.name);
  }

  const updatedRole = await updateRoleByIdAndOrgId(roleId, orgId, updates);
  if (!updatedRole) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
  }

  if (updates.permissions !== undefined || updates.permissions !== []) {
    logger.info(
      `Permissions changed for role ${roleId}. Wiping Redis cache...`,
    );
    await invalidateRoleCache(orgId, roleId);
  } else {
    logger.info(
      `Only text details changed for role ${roleId}. Cache preserved.`,
    );
  }

  return updatedRole;
};

const archieveRoleService = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found");
  }

  if (role.isSystemDefault) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "System default roles cannot be archived.",
    );
  }

  const archieveRole = await archiveRole(role, req.body);
  if (!archieveRole) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to archieve the role",
    );
  }
  return archieveRole;
};

export {
  getAllRolesService,
  createDefaultRolesForOrgService,
  createNewRoleService,
  editRoleService,
  archieveRoleService,
};
