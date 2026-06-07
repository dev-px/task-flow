import { Queue } from "bullmq";
import redisClient from "../config/redis.config.js";

export const emailQueue = new Queue("email-queue", {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});
