import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // deleted
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "archived", "completed"],
      default: "planning",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // visibility: {
    //   type: String,
    //   enum: ["private", "public"],
    //   default: "public",
    // },
    dueDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

projectSchema.index(
  { organizationId: 1, title: 1 }, // Scope uniqueness to the specific organization
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }, // Ignore deleted projects!
    collation: { locale: "en", strength: 2 }, // Case-insensitive uniqueness
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
