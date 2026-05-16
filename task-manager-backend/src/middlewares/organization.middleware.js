import redisClient from "./../config/redis.config.js";
import ApiError from "./../errors/ApiError.js";
import HTTP_STATUS from "./../constants/http-status.constant.js";
import { getMemberByUserIdAndOrganizationId } from "../modules/member/member.repository.js";


const requireOrganizationAccess = async (req, res, next) => {
  try {
    // Dynamic extraction supporting route params, query, or custom headers
    const organizationId = req.params.orgId || req.params.organizationId || req.headers["x-organization-id"];
    const userId = req.user._id; // Corrected from req.user.userId

    if (!organizationId) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, "Organization context is missing from request parameters."));
    }

    const cacheKey = `org:${organizationId}:member:${userId}`;
    let memberRecord;
    
    const cachedMember = await redisClient.get(cacheKey);

    if (cachedMember) {
      memberRecord = JSON.parse(cachedMember);
    } else {
      memberRecord = await getMemberByUserIdAndOrganizationId(userId, organizationId);

      // Cache only if it exists, is active, and is not archived
      if (memberRecord && memberRecord.status === "active" && !memberRecord.isArchived) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(memberRecord));
      }
    }

    // Unified lifecycle status verification
    if (!memberRecord) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have access to this organization."));
    }

    if (memberRecord.isArchived) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Your membership in this organization has been deleted/archived."));
    }

    if (memberRecord.status !== "active") {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, `Your organization access is blocked. Status: ${memberRecord.status}`));
    }

    // Attach full populated contextual scope
    req.member = memberRecord;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireOrganizationAccess;