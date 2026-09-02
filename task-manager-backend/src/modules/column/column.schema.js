import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    columnOrder: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

columnSchema.index(
  { projectId: 1, columnOrder: 1 },
  {
    partialFilterExpression: { isDeleted: false },
  },
);
columnSchema.index({ projectId: 1, isDeleted: 1, columnOrder: 1 });

const Column = mongoose.model("Column", columnSchema);

export default Column;
