import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  sequenceValue: { type: Number, default: 0 },
});

// Ensure one counter per type per organization
counterSchema.index({ organizationId: 1 }, { unique: true });

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
