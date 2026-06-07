// queues/organization.queue.js
import { Queue } from "bullmq";
import redisClient from "../config/redis.config.js";

export const orgDeletionQueue = new Queue("org-deletion", {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: true, // Auto-delete from Redis on success
    removeOnFail: false, // Keep in Redis if it crashes so we can inspect it
  },
});
