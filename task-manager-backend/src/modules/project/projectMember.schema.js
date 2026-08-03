import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // --- Soft Delete Fields ---
    // if any member leaves rhe project
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// The unique index WITH the partial filter expression
projectMemberSchema.index(
  { projectId: 1, memberId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  },
);

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);
export default ProjectMember;
