import mongoose from "mongoose";

const taskAssigneeSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

taskAssigneeSchema.index(
  { taskId: 1, memberId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  },
);
taskAssigneeSchema.index({ projectId: 1, memberId: 1, isDeleted: 1 });

const TaskAssignee = mongoose.model("TaskAssignee", taskAssigneeSchema);

export default TaskAssignee;
