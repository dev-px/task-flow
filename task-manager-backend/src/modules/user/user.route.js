import express from "express";
import asyncHandler from "../../utils/async-handler.util.js";
import requireAuth from "../../middlewares/auth.middleware.js";
import {
  editProfilePhotoController,
  editUserProfileController,
  getUserProfileController,
} from "./user.controller.js";
import {
  editProfilePhotoSchemaJOI,
  editUserProfileSchemaJOI,
} from "./user.validation.js";
import validate from "../../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/profile", requireAuth, getUserProfileController);

router.patch(
  "/edit-profile",
  requireAuth,
  validate(editUserProfileSchemaJOI, "body"),
  editUserProfileController,
);

router.patch(
  "/edit-profile-photo",
  requireAuth,
  validate(editProfilePhotoSchemaJOI, "body"),
  editProfilePhotoController,
);

export default router;
