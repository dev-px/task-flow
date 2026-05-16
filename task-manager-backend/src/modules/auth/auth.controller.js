import env from "../../config/env.config.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import {
  loginService,
  logoutService,
  refreshTokenService,
  signUpUser,
} from "./auth.service.js";

const signUpController = asyncHandler(async (req, res, next) => {
  const user = await signUpUser(req.body);

  if (user) {
    successResponse(
      res,
      "User registered successfully",
      user,
      HTTP_STATUS.CREATED,
    );
  }
});

const loginController = asyncHandler(async (req, res, next) => {
  const { user, accessToken, refreshToken } = await loginService(req.body);

  // Send the Refresh Token in a secure, HTTP-Only cookie
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  if (user) {
    successResponse(
      res,
      "User logged in successfully",
      { user, accessToken },
      HTTP_STATUS.OK,
    );
  }
});

const logoutController = asyncHandler(async (req, res, next) => {
  await logoutService(req.cookies.refreshToken);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.clearCookie("refreshToken", cookieOptions);

  successResponse(res, "User Logged out successfully", {}, HTTP_STATUS.OK);
});

const refreshTokenController = asyncHandler(async (req, res) => {
  const { refreshToken: incomingRefreshToken } = req.cookies;

  // Grab both new tokens from the service
  const { newAccessToken, newRefreshToken } =
    await refreshTokenService(incomingRefreshToken);

  // Overwrite the old cookie with the brand new Refresh Token
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  successResponse(
    res,
    "Token refreshed successfully",
    { accessToken: newAccessToken }, // Still only send Access Token in JSON
    HTTP_STATUS.OK,
  );
});

export {
  signUpController,
  loginController,
  logoutController,
  refreshTokenController,
};
