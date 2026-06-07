import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { buildInviteEmail } from "./email-template.util.js";

const generateInvitePayload = ({
  email,
  organizationId,
  adminId,
  batchId = null,
}) => {
  // 1. Generate Token & Expiry
  const token = jwt.sign({ email, organizationId }, env.JWT_SECRET, {
    expiresIn: "2d",
  });

  const inviteExpiresAt = new Date();
  inviteExpiresAt.setDate(inviteExpiresAt.getDate() + 2);

  // 2. Build the exact HTML template
  const template = buildInviteEmail(token);

  // 3. Standardize the BullMQ Job Data
  const jobData = {
    to: email,
    subject: template.subject,
    html: template.html,
    adminId,
    batchId,
    organizationId,
  };

  // 4. Standardize Retry Logic
  const jobOpts = {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  };

  // 5. Return the payload for the service to queue
  return {
    job: { name: "sendInviteEmail", data: jobData, opts: jobOpts },
    inviteExpiresAt,
  };
};

export default generateInvitePayload;
