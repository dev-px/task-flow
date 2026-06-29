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

const REDIS_URL =
  env.NODE_ENV === "development" ? env.LOCAL_REDIS_URL : env.PROD_REDIS_URL;
const redisClient = new Redis(REDIS_URL, redisOptions);

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

export default redisClient;
