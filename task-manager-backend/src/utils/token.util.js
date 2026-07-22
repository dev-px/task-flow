import jwt from "jsonwebtoken";
import redisClient from "../config/redis.config.js";
import env from "../config/env.config.js";
import logger from "../config/logger.config.js";

const generateTokens = async (userId, email, sessionId) => {
  const accessToken = jwt.sign({ userId, email, sessionId }, env.ACCESS_TOKEN, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ userId, sessionId }, env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  const sevenDaysInSeconds = 7 * 24 * 60 * 60;

  // await redisClient.setex(
  //   `refreshToken:${userId}`,
  //   sevenDaysInSeconds,
  //   refreshToken,
  // );

  // const savedToken = await redisClient.get(`refreshToken:${userId}`);
  // logger.info(`Verification - Token exists in Redis: ${!!savedToken}, ${savedToken}`);

  return { accessToken, refreshToken };
};

export default generateTokens;
