import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.status === "active";
      },
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    // --- INVITATION LIFECYCLE ---
    inviteEmail: {
      type: String,
      required: function () {
        return this.status === "invited";
      },
      trim: true,
      lowercase: true,
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invitedAt: { type: Date },
    acceptedAt: { type: Date },
    inviteExpiresAt: { type: Date },
    inviteResendCount: { type: Number, default: 0 },

    // --- DISPLAY / UI ---
    designation: { type: String, trim: true }, // Keep this! e.g., "Frontend Dev" is useful context on a task

    // status
    status: {
      type: String,
      enum: ["invited", "active", "suspended", "expired", "cancelled"],
      default: "invited",
    },

    // deletion
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // notification prefrenece
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      taskAssignedAlerts: { type: Boolean, default: true },
      taskStatusUpdates: { type: Boolean, default: false },
      dueDateReminders: { type: Boolean, default: true },
      mentionsAndComments: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

// Indexes for fast lookups
memberSchema.index({ organizationId: 1, inviteEmail: 1 });
memberSchema.index({ roleId: 1, userId: 1 });
memberSchema.index({ userId: 1, status: 1 });
memberSchema.index({ userId: 1, organizationId: 1 }, { unique: true, sparse: true });

const Member = mongoose.model("Member", memberSchema);

export default Member;
