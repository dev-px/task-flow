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

    // for invitation
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

    designation: { type: String, trim: true },
    joiningDate: { type: Date },
    employeeId: { type: String, trim: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "contractor"],
      default: "full-time",
    },

    // State of the membership
    status: {
      type: String,
      enum: ["invited", "active", "suspended", "expired", "cancelled"],
      default: "invited",
    },
    isArchived: { type: Boolean, default: false },
    //   user Preferences for specific company
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

// We need a new index to prevent sending multiple active invites to the same email
memberSchema.index({ organizationId: 1, inviteEmail: 1 });
memberSchema.index({ userId: 1, organizationId: 1 }, { unique: true });
memberSchema.index({ roleId: 1, userId: 1 });
memberSchema.index({ userId: 1, status: 1 });

const Member = mongoose.model("Member", memberSchema);

export default Member;
