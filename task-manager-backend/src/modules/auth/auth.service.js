import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env.config.js";
import ApiError from "../../errors/ApiError.js";
import logger from "../../config/logger.config.js";
import generateTokens from "../../utils/token.util.js";
import redisClient from "./../../config/redis.config.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { randomUUID } from "node:crypto";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../user/user.repository.js";
import {
  createSession,
  deleteAllSessions,
  deleteSession,
  getActiveSessions,
  getSession,
  updateSession,
} from "./session.service.js";
import { getSocketIoInstance } from "../../config/socket.config.js";

// register new user
const signUpUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "User already exists with this email",
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await createUser({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });
  if (!newUser) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "User registration failed, please try again",
    );
  }

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return userResponse;
};

// login user
const loginService = async (loginData, metadata) => {
  const sessionId = randomUUID();
  const { email, password } = loginData;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  // await updateUserById(user);

  const { accessToken, refreshToken } = await generateTokens(
    user._id,
    email,
    sessionId,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to sign you in. Please try again.",
    );
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const timestamp = new Date().toISOString();
  const sessionData = {
    sessionId,
    userId: user._id.toString(),
    refreshTokenHash,
    ...metadata,
    loginAt: timestamp,
    lastActiveAt: timestamp,
  };

  await createSession(user._id.toString(), sessionId, sessionData);

  const userResponse = user.toObject();
  delete userResponse.password;
  // console.log("userResponse", sessionData);

  return { user: userResponse, accessToken, refreshToken };
};

// refresh the token
const refreshTokenService = async (incomingRefreshToken, metadata) => {
  if (!incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN);
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Refresh token is expired or invalid. Please log in again.",
    );
  }

  if (!decoded || !decoded.userId || !decoded.sessionId) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token payload");
  }

  const session = await getSession(decoded.userId, decoded.sessionId);
  if (!session) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Session expired or revoked.");
  }

  const incomingRefreshTokenHash = crypto
    .createHash("sha256")
    .update(incomingRefreshToken)
    .digest("hex");

  // Token reuse/attack vector detection
  if (session.refreshTokenHash !== incomingRefreshTokenHash) {
    await deleteSession(decoded.userId, decoded.sessionId);
    logger.warn(
      `Refresh token reuse detected. User=${decoded.userId} Session=${decoded.sessionId}`,
    );
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Refresh token reuse detected. Session terminated.",
    );
  }

  const user = await findUserById(decoded.userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User account does not exist");
  }

  const { accessToken, refreshToken } = await generateTokens(
    user._id,
    user.email,
    decoded.sessionId,
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await updateSession(
    decoded.userId,
    decoded.sessionId,
    session,
    newRefreshTokenHash,
    metadata,
  );

  return { accessToken, refreshToken, user };
};

// logout user
const logoutService = async (refreshToken) => {
  if (!refreshToken) return;
  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN, {
      ignoreExpiration: true,
    });

    // console.log("decoded in logout", decoded)
    if (decoded) {
      await deleteSession(decoded.userId, decoded.sessionId);
      console.log("decoded", decoded);
    }
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Logout failed. Please try again.",
    );
  }
};

// logout from all the devices
const logoutAllDevicesService = async (refreshToken) => {
  if (!refreshToken)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "No token provided");
  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN, {
      ignoreExpiration: true,
    });

    if (decoded) {
      await deleteAllSessions(decoded.userId);
      
      // io.to(decoded.userId).emit("force-logout", {
      //   message: 
      // });
    }
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Global logout failed. Please try again.",
    );
  }
};

// get active session details
const getCurrentSessionService = async (userId, sessionId) => {
  const session = await getSession(userId, sessionId);

  if (!session) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Current session not found or expired.",
    );
  }

  // Strip sensitive data before sending to the client
  return {
    sessionId: session.sessionId,
    browser: session.browser,
    os: session.os,
    deviceType: session.deviceType,
    ipAddress: session.ipAddress,
    location: session.location,
    loginAt: session.loginAt,
    lastActiveAt: session.lastActiveAt,
    isCurrentDevice: true,
  };
};

// get all active sesison for a user
const getAllActiveSessionsService = async (userId, currentSessionId) => {
  const { count, sessions } = await getActiveSessions(userId, currentSessionId);

  return { count, sessions };
};

export {
  signUpUser,
  loginService,
  logoutService,
  logoutAllDevicesService,
  refreshTokenService,
  getCurrentSessionService,
  getAllActiveSessionsService,
};
