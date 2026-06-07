import logger from "../config/logger.config.js";
import { getSocketIoInstance } from "../config/socket.config.js";
import redisClient from "./../config/redis.config.js";

const checkBatchCompletion = async (batchId, adminId, failedEmail = null) => {
  if (!batchId || !adminId) return;

  const io = getSocketIoInstance();
  const batchKey = `batch:${batchId}`;
  const failedListKey = `batch:${batchId}:failures`;

  try {
    // 1. If an email completely failed, save it to a Redis Set
    if (failedEmail) {
      await redisClient.sadd(failedListKey, failedEmail);
    }

    // 2. Increment the processed counter
    const processed = await redisClient.hincrby(batchKey, "processed", 1);
    const total = await redisClient.hget(batchKey, "total");

    // 3. Is the whole batch finished?
    if (processed >= parseInt(total)) {
      logger.info(`Batch ${batchId} completed.`);

      // Get all the emails that failed (if any)
      const failedEmails = await redisClient.smembers(failedListKey);
      const successCount = total - failedEmails.length;

      // Send the final detailed report to the frontend
      if (io) {
        io.to(adminId).emit("notification", {
          type: failedEmails.length > 0 ? "PARTIAL_SUCCESS" : "SUCCESS",
          message: `Processed ${total} invites. ${successCount} succeeded.`,
          failedCount: failedEmails.length,
          failedEmails: failedEmails, // Array like: ["bad@email.com", "fake@test.com"]
        });
      }

      // 4. Clean up Redis memory
      await redisClient.del(batchKey, failedListKey);
    }
  } catch (error) {
    logger.error(`Error checking batch completion:`, error);
  }
};

export default checkBatchCompletion;
