import logger from "../config/logger.config.js";
import redisClient from "../config/redis.config.js";
import Member from "../modules/member/member.schema.js";

const invalidateRoleCache = async (organizationId, roleId) => {
  try {
    const affectedMembers = await Member.find({
      organizationId,
      roleId,
    }).select("userId");

    if (affectedMembers.length === 0) return;

    const keysToDelete = affectedMembers.map(
      (member) => `org:${organizationId}:member:${member.userId}`,
    );

    await redisClient.del(keysToDelete);

    logger.info(
      `[Redis] Cleared cache for ${keysToDelete.length} members after role update.`,
    );
  } catch (error) {
    logger.error("[Redis Invalidation Error]:", error);
  }
};

/**
 * Wipes the cache for a SINGLE member.
 * Call this when a member's role is changed, or when they are removed from the workspace.
 */
// const invalidateSingleMemberCache = async (organizationId, userId) => {
//   try {
//     const cacheKey = `org:${organizationId}:member:${userId}`;
//     await redisClient.del(cacheKey);
//     // console.log(`[Redis] Cleared cache for user ${userId}`);
//   } catch (error) {
//     logger.error("[Redis Invalidation Error]:", error);
//   }
// };

export default invalidateRoleCache;
