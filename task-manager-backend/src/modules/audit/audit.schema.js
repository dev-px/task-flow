// src/modules/audit/audit.schema.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true, // Crucial for fetching the history of a whole workspace
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The human who pressed the button
      required: true,
    },
    action: {
      type: String,
      required: true,
      // Examples: "TASK_CREATED", "ROLE_UPDATED", "MEMBER_REMOVED"
    },
    entityType: {
      type: String,
      required: true,
      enum: ["Task", "Project", "Member", "Role", "Organization", "User"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true, // Crucial for fetching the history of a specific task
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      // Store the "Before" and "After" state here!
      // e.g., { previousStatus: "In Progress", newStatus: "Done" }
    },
    ipAddress: { type: String }, // Good for security tracking

    // deletion
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Compound index to quickly load the "Activity Feed" for a specific project or task
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
