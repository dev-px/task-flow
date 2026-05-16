// src/utils/invite.util.js
import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { emailQueue } from "../queues/email.queue.js";

const generateAndQueueInvite = async ({
  email,
  orgId,
  adminId,
  batchId = null,
}) => {
  // 1. Generate token
  const token = jwt.sign({ email, orgId }, env.JWT_SECRET, { expiresIn: "2d" });

  // 2. Calculate Expiry Date (2 days from now)
  const inviteExpiresAt = new Date();
  inviteExpiresAt.setDate(inviteExpiresAt.getDate() + 2);

  // 3. Queue Email
  const jobData = { email, orgId, token, adminId, batchId };
  if (batchId) {
    return { job: { name: "sendInviteEmail", data: jobData }, inviteExpiresAt };
  } else {
    await emailQueue.add("sendInviteEmail", jobData);
    return { inviteExpiresAt };
  }
};

export default generateAndQueueInvite;
