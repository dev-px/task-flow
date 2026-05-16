import logger from "../../config/logger.config.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import {
  ALL_PERMISSIONS,
  PERMISSIONS,
} from "../../constants/permissions.constant.js";
import ApiError from "../../errors/ApiError.js";
import invalidateRoleCache from "../../helpers/redis-cache.helper.js";
import slugify from "../../utils/slug.util.js";
import {
  createManyRoles,
  getRoleById,
  getRoleByOrgIdAndSlug,
  updateRoleByIdAndOrgId,
} from "./role.respository.js";

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
  const defaultRoles = [
    {
      name: "Owner",
      description: "Full administrative access to the entire workspace.",
      organizationId,
      permissions: ALL_PERMISSIONS, // The Owner gets every single power
      isSystemDefault: true, // Cannot be deleted
    },
    {
      name: "Admin",
      description:
        "Can manage projects, team members, and settings, but cannot manage billing.",
      organizationId,
      permissions: ALL_PERMISSIONS.filter(
        (perm) => perm !== PERMISSIONS.ORG_BILLING_MANAGE, // Exclude billing
      ),
      isSystemDefault: true, // Cannot be deleted
    },
    {
      name: "Member",
      description:
        "Standard employee. Can read projects and manage their own tasks.",
      organizationId,
      permissions: [
        PERMISSIONS.PROJECT_READ,
        PERMISSIONS.TASK_READ,
        PERMISSIONS.TASK_CREATE,
        PERMISSIONS.TASK_EDIT,
        PERMISSIONS.MEMBER_READ,
      ],
      isSystemDefault: true,
    },
    {
      name: "Guest",
      description:
        "External collaborator or client. Read-only access to projects and tasks.",
      organizationId,
      permissions: [PERMISSIONS.PROJECT_READ, PERMISSIONS.TASK_READ],
      isSystemDefault: true,
    },
  ];

  // Insert all three roles into the database at the exact same time
  const [createdRoles] = await createManyRoles(defaultRoles, { session });
  if (!createdRoles || createdRoles.length !== defaultRoles.length) {
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Failed to create default roles for the organization.",
    );
  }
  return createdRoles;
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
