import express from "express";
import validate from "../../middlewares/validation.middleware.js";
import { loginUserSchemaJOI, signUpUserSchemaJOI } from "./auth.validation.js";
import {
  loginController,
  logoutController,
  refreshTokenController,
  signUpController,
} from "./auth.controller.js";

const router = express.Router();

router.post("/signup", validate(signUpUserSchemaJOI, "body"), signUpController);

router.post("/login", validate(loginUserSchemaJOI, "body"), loginController);

router.post("/logout", logoutController);

router.post("/refresh-token", refreshTokenController);

export default router;
