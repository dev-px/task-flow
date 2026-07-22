import jwt from "jsonwebtoken";
import HTTP_STATUS from "../constants/http-status.constant.js";
import ApiError from "./../errors/ApiError.js";
import env from "./../config/env.config.js";
import { getUserById } from "../modules/user/user.repository.js";
import redisClient from "../config/redis.config.js";

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Access denied. No token provided.",
      ),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN);

    const redis_session_key = `session:${decoded.sessionId}`;
    const sessionExists = await redisClient.get(redis_session_key);

    if (!sessionExists) {
      res.clearCookie("refreshToken");
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "Session revoked or expired."),
      );
    }

    // 2. Verify global user existence
    const user = await getUserById(decoded.userId);
    if (!user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, "User no longer exists."),
      );
    }

    if (user.status === "suspended") {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "This account has been globally suspended.",
        ),
      );
    }

    req.user = user;
    req.sessionId = decoded.sessionId;
    next();
  } catch (error) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired access token.",
      ),
    );
  }
};

export default requireAuth;
