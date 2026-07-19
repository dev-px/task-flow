import express from "express";
import validate from "../../middlewares/validation.middleware.js";
import { loginUserSchemaJOI, signUpUserSchemaJOI } from "./auth.validation.js";
import requireAuth from "./../../middlewares/auth.middleware.js";
import {
  getAllActiveSessionsController,
  getCurrentSessionController,
  loginController,
  logoutAllDevicesController,
  logoutController,
  refreshTokenController,
  signUpController,
} from "./auth.controller.js";

const router = express.Router();

router.post("/signup", validate(signUpUserSchemaJOI, "body"), signUpController);

router.post("/login", validate(loginUserSchemaJOI, "body"), loginController);

router.post("/refresh-token", refreshTokenController);

router.post("/logout", logoutController);

router.post("/logout-all-devices", requireAuth, logoutAllDevicesController);

router.get("/active-session", requireAuth, getCurrentSessionController);

router.get("/active-all-session", requireAuth, getAllActiveSessionsController);

export default router;
