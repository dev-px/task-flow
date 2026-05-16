import mongoose from "mongoose";
import slugify from "../../utils/slug.util.js";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    logoUrl: { type: String, default: "" },
    companyEmail: { type: String, trim: true },
    companyPhone: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    timezone: { type: String, default: "UTC" },
    businessHours: { type: String, default: "09:00-17:00" },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        enum: ["Free", "Business Pro", "Enterprise"],
        default: "Free",
      },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
      billingCycle: {
        type: String,
        enum: ["Monthly", "Annually"],
        default: "Monthly",
      },
      autoRenewal: { type: Boolean, default: true },
      totalSeats: { type: Number, default: 5 },
    },
  },
  { timestamps: true },
);

organizationSchema.index({ creatorId: 1 }, { unique: true });

organizationSchema.pre("validate", function (next) {
  if (this.isNew && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
