// src/modules/auth/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../user/user.repository.js";
import ApiError from "../../errors/ApiError.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import env from "../../config/env.config.js";
import redisClient from "./../../config/redis.config.js";
import logger from "../../config/logger.config.js";
import generateTokens from "../../utils/token.util.js";

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
const loginService = async (loginData) => {
  const { email, password } = loginData;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  await updateUserById(user);

  const { accessToken, refreshToken } = await generateTokens(user._id, email);

  if (!accessToken || !refreshToken) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to sign you in. Please try again.",
    );
  }

  // 6. Clean up the user object to send back
  const userResponse = user.toObject();
  if (!userResponse) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "login failed, please try again",
    );
  }
  delete userResponse.password;

  return { user: userResponse, accessToken, refreshToken };
};

// refresh the token
const refreshTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "No refresh token provided");
  }

  const decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN);
  if (!decoded || !decoded.userId) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  }

  // getting the current valid token from Redis for this user
  const storedToken = await redisClient.get(`refreshToken:${decoded.userId}`);

  // 2. THE KILL SWITCH (Reuse Detection)
  //  incoming refresh token does not match with the one stored in Redis, which means it has been reused
  if (storedToken !== incomingRefreshToken) {
    await redisClient.del(`refreshToken:${decoded.userId}`);
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Security Alert: Token reuse detected. Session terminated.",
    );
  }

  const user = await findUserById(decoded.userId);
  if (!user)
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User account not exists");

  const { accessToken, refreshToken } = await generateTokens(
    user._id,
    user.email,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to sign you in. Please try again.",
    );
  }

  return { accessToken, refreshToken };
};

// logout user
const logoutService = async (refreshToken) => {
  if (!refreshToken) return;

  try {
    // ignoreExpiration: true allows us to decode the user ID even if the token died of old age,
    // which is important for logout because we want to delete the token from Redis regardless of its expiration status
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN, {
      ignoreExpiration: true,
    });

    if (decoded && decoded.userId) {
      await redisClient.del(`refreshToken:${decoded.userId}`);
    }
  } catch (error) {}
};

export { signUpUser, loginService, logoutService, refreshTokenService };
