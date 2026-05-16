import { Queue, Worker } from "bullmq";
import redisClient from "../config/redis.config.js";
import env from "./../config/env.config.js";
import { getSocketIoInstance } from "../config/socket.config.js";
import transporter from "./../config/mailer.config.js";
import logger from "../config/logger.config.js";

const QUEUE_NAME = "email-invitations";

export const emailQueue = new Queue(QUEUE_NAME, {
  connection: redisClient,
});

// Helper: Safely check if the entire batch of emails is finished
const checkBatchCompletion = async (batchId, adminId, io) => {
  if (!batchId || !adminId || !io) return;

  const batchKey = `batch:${batchId}`;

  // Atomically increment the processed count (safe for concurrent workers)
  const processed = await redisClient.hincrby(batchKey, "processed", 1);
  const total = await redisClient.hget(batchKey, "total");

  // If all emails in this batch have been attempted (success or fail)
  if (processed >= parseInt(total)) {
    io.to(adminId).emit("notification", {
      type: "SUCCESS",
      message: `All ${total} bulk invitations have been processed!`,
    });
    // Clean up Redis
    await redisClient.del(batchKey);
  }
};

const emailWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    // We added 'adminId' so we know exactly whose screen to update
    const { email, orgId, token, adminId } = job.data;
    const inviteLink = `${env.CLIENT_URL}/accept-invite?token=${token}`;

    await transporter.sendMail({
      from: `"Your SaaS App" <${env.SMTP_EMAIL}>`,
      to: email,
      subject: "You have been invited to join the workspace!",
      html: `
      <h2>Welcome to the Team!</h2>
      <p>Click the link below to set up your account. This link expires in 48 hours.</p>
      <a href="${inviteLink}">Accept Invitation</a>
    `,
    });

    // emitter logic
    // After the email successfully sends, notify the frontend
    const io = getSocketIoInstance();
    if (io && adminId) {
      io.to(adminId).emit("invite_progress", {
        email: email,
        status: "Success",
        message: `Invitation successfully sent to ${email}`,
      });
    }
  },
  {
    connection: redisClient,
    limiter: {
      max: 5,
      duration: 1000,
    },
  },
);

// Handle worker events
emailWorker.on("completed", async (job) => {
  logger.info(`Job ${job.id} finished.`);
  const io = getSocketIoInstance();
  await checkBatchCompletion(job.data.batchId, job.data.adminId, io);
});

emailWorker.on("failed", async (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);

  const io = getSocketIoInstance();
  if (io && job.data.adminId) {
    // Emit INDIVIDUAL failure
    io.to(job.data.adminId).emit("invite_progress", {
      email: job.data.email,
      status: "Failed",
      message: err.message || "Failed to send email",
    });

    // Even if it fails, it counts as "processed" towards the total batch completion
    await checkBatchCompletion(job.data.batchId, job.data.adminId, io);
  }
});
