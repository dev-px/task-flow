import ApiError from "../errors/ApiError.js";
import HTTP_STATUS from "../constants/http-status.constant.js";

const enforceReadOnly = async (req, res, next) => {
  try {
    // Always allow Read operations
    if (req.method === "GET") {
      return next();
    }

    // Extract billing info (assuming requireOrganizationAccess populates req.member.organizationId)
    // If your middleware doesn't populate the full org object, you may need to fetch it from Redis/DB here.
    const organization = req.member.organizationId;
    const billing = organization.billing || {
      currentPlan: "Free",
      status: "active",
    };

    // Define statuses that trigger the Read-Only lock
    const restrictedStatuses = ["past_due", "canceled", "expired", "unpaid"];

    // Enforce the lock if the Pro plan is in a restricted state
    if (
      billing.currentPlan === "Pro" &&
      restrictedStatuses.includes(billing.status)
    ) {
      return next(
        new ApiError(
          HTTP_STATUS.PAYMENT_REQUIRED, // 402
          "Your Pro subscription has expired. Your organization is in read-only mode. Please update your billing to resume activities.",
        ),
      );
    }

    // If everything is active, allow the mutation to proceed
    next();
  } catch (error) {
    next(error);
  }
};

export default enforceReadOnly;
