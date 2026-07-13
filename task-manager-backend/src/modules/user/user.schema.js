// src/modules/user/user.schema.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    secondaryEmail: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (v) => v === "" ? undefined : v, 
    },
    avatarUrl: { type: String, default: "" },

    password: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    isInvited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
