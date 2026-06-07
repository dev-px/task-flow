import redisClient from "./../config/redis.config.js";
import ApiError from "./../errors/ApiError.js";
import HTTP_STATUS from "./../constants/http-status.constant.js";
import { getMemberByUserIdAndOrganizationId } from "../modules/member/member.repository.js";
import logger from "../config/logger.config.js";
import { getOrganizationById } from "../modules/organization/organization.repository.js";

const requireOrganizationAccess = async (req, res, next) => {
  try {
    // Dynamic extraction supporting route params, query, or custom headers
    const organizationId = req.params.orgId;
    const userId = req.user.id;

    const cacheKey = `org:${organizationId}:member:${userId}`;
    let memberRecord;

    const cachedMember = await redisClient.get(cacheKey);

    if (cachedMember) {
      memberRecord = JSON.parse(cachedMember);
    } else {
      memberRecord = await getMemberByUserIdAndOrganizationId(
        userId,
        organizationId,
      );
      console.log("memberRecord", memberRecord, req.params.orgId, req.user.id);

      // Cache only if it exists, is active, and is not deleted
      if (
        memberRecord &&
        memberRecord.status === "active" &&
        !memberRecord.isDeleted
      ) {
        await redisClient.setex(cacheKey, 3600, JSON.stringify(memberRecord));
      }
    }

    // Unified lifecycle status verification
    if (!memberRecord) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have access to this organization.",
        ),
      );
    }

    if (memberRecord.isDeleted) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Your membership in this organization has been deleted/archived.",
        ),
      );
    }

    if (memberRecord.status !== "active") {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Your organization access is blocked. Status: ${memberRecord.status}`,
        ),
      );
    }

    // Attach full populated contextual scope
    req.member = memberRecord;
    // const savedCache = await redisClient.get(cacheKey);
    // logger.info(`SavedCache exists in Redis: ${!!savedCache}, ${savedCache}`);
    console.log("Organization access granted for user:", {
      id: userId,
      orgId: organizationId,
      memberStatus: memberRecord.status,
    });
    next();
  } catch (error) {
    next(error);
  }
};

// const requireOrganizationDeleteAccess = async (req, res, next) => {
//   try {
//     // Dynamic extraction supporting route params, query, or custom headers
//     const organizationId = req.params.orgId;
//     const userId = req.user.id;

//     const organization = await getOrganizationById(organizationId);
//     if (organization.creatorId !== userId) {
//       return next(
//         new ApiError(
//           HTTP_STATUS.FORBIDDEN,
//           "Access denied. You do not have permission to delete this organization.",
//         ),
//       );
//     }

//     const cacheKey = `org:${organizationId}:member:${userId}`;
//     let memberRecord;

//     const cachedMember = await redisClient.get(cacheKey);

//     if (cachedMember) {
//       memberRecord = JSON.parse(cachedMember);
//     } else {
//       memberRecord = await getMemberByUserIdAndOrganizationId(
//         userId,
//         organizationId,
//       );

//       // Cache only if it exists, is active, and is not archived
//       if (
//         memberRecord &&
//         memberRecord.status === "active" &&
//         !memberRecord.isDeleted
//       ) {
//         await redisClient.setex(cacheKey, 3600, JSON.stringify(memberRecord));
//       }
//     }

//     // Unified lifecycle status verification
//     if (!memberRecord) {
//       return next(
//         new ApiError(
//           HTTP_STATUS.FORBIDDEN,
//           "You do not have access to this organization.",
//         ),
//       );
//     }

//     if (memberRecord.isDeleted) {
//       return next(
//         new ApiError(
//           HTTP_STATUS.FORBIDDEN,
//           "Your membership in this organization has been deleted/archived.",
//         ),
//       );
//     }

//     if (memberRecord.status !== "active") {
//       return next(
//         new ApiError(
//           HTTP_STATUS.FORBIDDEN,
//           `Your organization access is blocked. Status: ${memberRecord.status}`,
//         ),
//       );
//     }

//     // // Attach full populated contextual scope
//     req.member = memberRecord;
//     const savedCache = await redisClient.get(cacheKey);
//     logger.info(`SavedCache exists in Redis: ${!!savedCache}, ${savedCache}`);
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

export default requireOrganizationAccess;
