export const PERMISSIONS = {
  // organization-level permissions
  ORG_READ: "org:read",
  ORG_CREATE: "org:create",
  ORG_EDIT: "org:edit",
  ORG_DELETE: "org:delete",

  ORG_GENERAL_EDIT: "org:general:edit",
  ORG_SECURITY_EDIT: "org:security:edit",
  ORG_BILLING_VIEW: "org:billing:view",
  ORG_BILLING_MANAGE: "org:billing:manage",

  // role-level permissions
  ROLE_READ: "role:read",
  ROLE_CREATE: "role:create",
  ROLE_EDIT: "role:edit",
  ROLE_ARCHIVE: "role:archive",

  // project-level permissions
  PROJECT_CREATE: "project:create",
  PROJECT_READ: "project:read",
  PROJECT_EDIT: "project:edit",
  PROJECT_DELETE: "project:delete",

  // task-level permissions
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_EDIT: "task:edit",
  TASK_DELETE: "task:delete",

  // member-level permissions
  MEMBER_READ: "member:read",
  MEMBER_CREATE: "member:create",
  MEMBER_EDIT: "member:edit",
  MEMBER_DELETE: "member:delete",
  MEMBER_CANCEL_INVITE: "member:cancel",
  MEMBER_REVOKED_ACCESS: "member:revoked"
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
