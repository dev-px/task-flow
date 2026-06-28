export const PLAN_LIMITS = {
  free: {
    maxMembers: 3,
    maxRoles: 10,
    maxProjects: 5,
    maxTasks: 20,
    features: {
      canExportData: false,
      hasPrioritySupport: false,
    },
  },
  pro: {
    maxMembers: 50,
    maxRoles: 25,
    maxProjects: 100,
    maxTasks: 2000,
    features: {
      canExportData: true,
      hasPrioritySupport: true,
    },
  },
};
