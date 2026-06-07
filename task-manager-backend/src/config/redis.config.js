import Redis from "ioredis";
import logger from "./logger.config.js";
import env from "./env.config.js";

const redisOptions = {
  maxRetriesPerRequest: null,
  family: 0,
  tls: env.REDIS_URL?.startsWith("rediss://")
    ? {
        rejectUnauthorized: false, // Helps avoid local certificate issues
      }
    : undefined,
};

// REDIS_URL exists in .env (Upstash), it connects to the cloud.
// new Redis() defaults to localhost:6379
const redisClient = env.REDIS_URL
  ? new Redis(env.REDIS_URL, redisOptions)
  : new Redis({ host: "localhost", port: 6379, ...redisOptions });

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

export default redisClient;
