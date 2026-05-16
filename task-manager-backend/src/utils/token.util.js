import jwt from "jsonwebtoken";
import redisClient from "../config/redis.config.js";
import env from "../config/env.config.js";

const generateTokens = async (userId, email) => {
  const accessToken = jwt.sign(
    { userId: userId, email: email },
    env.ACCESS_TOKEN,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign({ userId: userId }, env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  const sevenDaysInSeconds = 7 * 24 * 60 * 60;

  await redisClient.setex(
    `refreshToken:${userId}`,
    sevenDaysInSeconds,
    refreshToken,
  );

  return { accessToken, refreshToken };
};

export default generateTokens;
