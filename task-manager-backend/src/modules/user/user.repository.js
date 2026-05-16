import ApiError from "../../errors/ApiError.js";
import { User } from "./user.schema.js";

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }
  return user;
};

const findUserByEmail = async (email, session = null) => {
  return await User.findOne({ email }).session(session).select("+password");
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData, session = null) => {
  const [user] = await User.create([userData], { session });
  return user;
};

const updateUserById = async (userId, updateData, session = null) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true, session },
  );
  if (!updatedUser) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  return updatedUser;
};

export {
  getUserById,
  findUserByEmail,
  createUser,
  findUserById,
  updateUserById,
};
