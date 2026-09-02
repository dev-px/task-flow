import ApiError from "../errors/ApiError.js";
import Task from "../modules/task/task.schema.js";
import Member from "../modules/member/member.schema.js";
import Project from "./../modules/project/project.schema.js";
import HTTP_STATUS from "../constants/http-status.constant.js";
import { getEffectiveLimits } from "../utils/billing.util.js";
import TaskAssignee from "../modules/task/taskAssignee.schema.js";

const checkPlan = (requestType) => {
  return async (req, res, next) => {
    try {
      const { _id: memberId, userId, organizationId } = req.member;
      // console.log("req.member", req.member, memberId, userId, organizationId)

      const limits = getEffectiveLimits(organizationId);
      const orgId = organizationId?._id;
      const billing = organizationId.billing || {};
      let currentCount = 0;
      let limit = 0;
      console.log("checking values", orgId, organizationId?._id);

      const validStatuses = ["active", "trialing"];
      if (
        billing.currentPlan === "Pro" &&
        !validStatuses.includes(billing.status)
      ) {
        return next(
          new ApiError(
            HTTP_STATUS.PAYMENT_REQUIRED, // 402
            `Your Pro plan is currently marked as '${billing.status}'. Please update your billing information to continue creating ${requestType}.`,
          ),
        );
      }

      if (requestType === "projects") {
        currentCount = await Project.countDocuments({
          organizationId: orgId,
          isDeleted: false,
        });
        limit = limits?.maxProjects;
      } else if (requestType === "members") {
        currentCount = await Member.countDocuments({
          organizationId: orgId,
          isDeleted: false,
        });
        limit = limits.maxMembers;
      } else if (requestType === "task") {
        currentCount = Task.countDocuments({
          organizationId: orgId,
          projectId: req?.params?.projectId,
          isDeleted: false,
        });
        limit = limits.maxTasks;
      } else {
        return next(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Invalid resource type passed to billing middleware.",
          ),
        );
      }

      if (limit !== -1 && currentCount >= limit) {
        return next(
          new ApiError(
            HTTP_STATUS.PAYMENT_REQUIRED, // 402
            `Your organization has reached the limit of ${limit} ${requestType} on the ${billing.currentPlan} plan. Please upgrade.`,
          ),
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkPlan;
