import {
  errorResponse,
  successResponse,
} from "../../utils/api-response.util.js";
import { getProfileService } from "./user.service.js";
import { editProfileService } from "./user.service.js";
import HTTP_STATUS from "./../../constants/http-status.constant.js";
import asyncHandler from "./../../utils/async-handler.util.js";

const getUserProfileController = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await getProfileService(userId);

  successResponse(
    res,
    "User Profile retrived successfully",
    user,
    HTTP_STATUS.OK,
  );
});

const editUserProfileController = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await editProfileService(userId, req.body);

  successResponse(
    res,
    "User Profile updated successfully",
    user,
    HTTP_STATUS.CREATED,
  );
});

const editProfilePhotoController = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await editProfilePhotoService(userId, req.body);

  successResponse(
    res,
    "User Profile updated successfully",
    user,
    HTTP_STATUS.CREATED,
  );
});

export {
  getUserProfileController,
  editUserProfileController,
  editProfilePhotoController,
};
