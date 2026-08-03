const PLAN_LIMITS = {
  free: {
    maxMembers: 15,
    maxProjects: 2,
    maxTasks: 100,
    features: {
      canExportData: false,
      hasPrioritySupport: false,
    },
  },
  enterprise: {
    maxMembers: -1, 
    maxProjects: -1,
    maxTasks: -1,
    features: {
      canExportData: true,
      hasPrioritySupport: true,
    },
  },
};

const getEffectiveLimits = (organization) => {
  console.log("checking billing plan for org", organization)
  const planName = organization.billing?.currentPlan || "free";
  const baseLimits = PLAN_LIMITS[planName] || PLAN_LIMITS.free;

  const overrides = organization.billing?.customLimitsOverrides || {};

  // Merge them: If an override exists in the DB, use it. Otherwise, use base.
  return {
    maxMembers: overrides.maxMembers ?? baseLimits.maxMembers,
    maxProjects: overrides.maxProjects ?? baseLimits.maxProjects,
    maxTasks: overrides.maxTasks ?? baseLimits.maxTasks,
    features: baseLimits.features, 
  };
};

export {PLAN_LIMITS, getEffectiveLimits};