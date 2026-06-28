import mongoose from "mongoose";
import slugify from "../../utils/slug.util.js";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    logoUrl: { type: String, default: "" },
    companyEmail: { type: String, trim: true, default: "" },
    companyPhone: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    timezone: { type: String, default: "UTC" },
    businessHours: { type: String, default: "09:00-17:00" },
    deletionStatus: {
      type: String,
      enum: ["active", "deleting", "deleted"],
      default: "active",
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true
    },

    // security: {
    //   passwordPolicy: {
    //     type: String,
    //     enum: ["Standard", "Strong", "Custom"],
    //     default: "Strong",
    //   },
    //   twoFactorAuthentication: { type: Boolean, default: false },
    //   enforce2FAForAdmins: { type: Boolean, default: true },
    //   sessionTimeout: { type: Number, default: 30 },
    //   maxConcurrentSessions: { type: Number, default: 3 },
    //   ipWhitelisting: { type: Boolean, default: false },
    //   whitelistedIPs: [{ type: String }],
    // },

    billing: {
      currentPlan: {
        type: String,
        enum: ["Free", "pro", "enterprise"],
        default: "Free",
      },
      stripeCustomerId: { type: String, default: "" },
      stripeSubscriptionId: { type: String, default: "" },
      billingCycle: {
        type: String,
        enum: ["Monthly", "Annually"],
        default: "Monthly",
      },
      status: {
        type: String,
        enum: ["active", "past_due", "canceled"],
        default: "active",
      },
      autoRenewal: { type: Boolean, default: true },
    },

    // deleting
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

organizationSchema.pre("validate", function (next) {
  if (this.isNew && this.name) {
    this.slug = slugify(this.name);
  }
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
