import geoip from "geoip-lite";
import env from "../../config/env.config.js";
import asyncHandler from "./../../utils/async-handler.util.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { successResponse } from "../../utils/api-response.util.js";
import {
  getAllActiveSessionsService,
  getCurrentSessionService,
  loginService,
  logoutAllDevicesService,
  logoutService,
  refreshTokenService,
  signUpUser,
} from "./auth.service.js";
import { getSocketIoInstance } from "../../config/socket.config.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

const helperSessionMetadata = (req) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection.remoteAddress;
  const deviceType = req.useragent.isMobile
    ? "Mobile"
    : req.useragent.isTablet
      ? "Tablet"
      : "Desktop";
  const browser = req.useragent.browser;
  const os = req.useragent.os;

  const geo = geoip.lookup(ip);
  const location = geo
    ? { country: geo.country, region: geo.region, city: geo.city }
    : "Unknown";

  const metadata = {
    ipAddress: ip,
    deviceType,
    browser,
    os,
    location,
  };

  return metadata;
};

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
  const metadata = helperSessionMetadata(req);
  const { user, accessToken, refreshToken } = await loginService(
    req.body,
    metadata,
  );

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

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
  res.clearCookie("refreshToken", cookieOptions);

  return successResponse(
    res,
    "Logged out from this device successfully",
    {},
    HTTP_STATUS.OK,
  );
});

const logoutAllDevicesController = asyncHandler(async (req, res, next) => {
  await logoutAllDevicesService(req.cookies.refreshToken);
  const io = getSocketIoInstance();

  res.clearCookie("refreshToken", cookieOptions);

  io.to(req.user._id.toString()).emit("force_logout", {
    message: "Your session was terminated from another device.",
  });

  return successResponse(
    res,
    "Logged out from all devices successfully",
    {},
    HTTP_STATUS.OK,
  );
});

const refreshTokenController = asyncHandler(async (req, res, next) => {
  const metadata = helperSessionMetadata(req);
  const { refreshToken: incomingRefreshToken } = req.cookies;
  try {
    const { accessToken, refreshToken, user } = await refreshTokenService(
      incomingRefreshToken,
      metadata,
    );

    // Overwrite the old cookie with the brand new Refresh Token
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(
      res,
      "Token refreshed successfully",
      { accessToken, user },
      HTTP_STATUS.OK,
    );
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    return next(error);
  }
});

const getCurrentSessionController = asyncHandler(async (req, res, next) => {
  // Extract userId from the DB user document, and sessionId from the request
  const userId = req.user._id.toString();
  const sessionId = req.sessionId;

  const session = await getCurrentSessionService(userId, sessionId);

  return successResponse(
    res,
    "Current session fetched successfully",
    { session },
    HTTP_STATUS.OK,
  );
});

const getAllActiveSessionsController = asyncHandler(async (req, res, next) => {
  console.log(req.user, req.sessionId);
  const userId = req.user._id.toString();
  const sessionId = req.sessionId;

  const { count, sessions } = await getAllActiveSessionsService(
    userId,
    sessionId,
  );

  return successResponse(
    res,
    "All active sessions fetched successfully",
    { count, sessions },
    HTTP_STATUS.OK,
  );
});

export {
  signUpController,
  loginController,
  logoutController,
  logoutAllDevicesController,
  refreshTokenController,
  getCurrentSessionController,
  getAllActiveSessionsController,
};
