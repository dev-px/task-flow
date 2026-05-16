import mongoose from "mongoose";
import { ALL_PERMISSIONS } from "./../../constants/permissions.constant.js";
import slugify from "../../utils/slug.util.js";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      immutable: true,
    },
    description: { type: String, trim: true, default: "" },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // array of permissions strings
    permissions: [
      {
        type: String,
        enum: ALL_PERMISSIONS,
      },
    ],

    // Protects the "Owner" and "Admin" roles from being accidentally deleted
    isSystemDefault: { type: Boolean, default: false, immutable: true },
    isArchived: { type: Boolean, default: false },
    archieveDescription: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

// Prevent duplicate role names within the SAME organization
roleSchema.index({ organizationId: 1, name: 1 }, { unique: true });
roleSchema.index({ organizationId: 1, slug: 1 }, { unique: true });

roleSchema.pre("validate", function (next) {
  if (this.isNew && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Role = mongoose.model("Role", roleSchema);
