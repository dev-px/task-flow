import { ALL_PERMISSIONS, PERMISSIONS } from "./permissions.constant.js";

const fnDefaultRoleCreation = (organizationId) => {
  // console.log("organizationId", organizationId);
  return [
    {
      name: "Owner",
      description: "Full administrative access to the entire workspace.",
      organizationId,
      permissions: ALL_PERMISSIONS,
      isSystemDefault: true,
    },
    {
      name: "Admin",
      description:
        "Can manage projects, team members, and settings, but cannot manage billing.",
      organizationId,
      permissions: ALL_PERMISSIONS.filter(
        (perm) => perm !== PERMISSIONS.ORG_BILLING_MANAGE,
      ),
      isSystemDefault: true,
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
};

export default fnDefaultRoleCreation;
