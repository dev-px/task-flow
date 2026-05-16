import ApiError from "../../errors/ApiError.js";
import { findUserById, updateUserById } from "./user.repository.js";

const getProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }
  delete user.password;
  return user;
};

const editProfileService = async (userId, updateData) => {
  await getProfileService(userId);
  const userUpdatedData = await updateUserById(userId, updateData);
  return userUpdatedData;
};

const editProfilePhotoService = async (userId, updateData) => {
  await getProfileService(userId);
  const userUpdatedData = await updateUserById(userId, updateData);
  return userUpdatedData;
};

export { getProfileService, editProfileService, editProfilePhotoService };
