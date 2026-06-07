import { Worker } from "bullmq";
import transporter from "./../config/mailer.config.js";
import { getSocketIoInstance } from "../config/socket.config.js";
import redisClient from "../config/redis.config.js";
import logger from "../config/logger.config.js";
import checkBatchCompletion from "../helpers/batch.helper.js";
import env from "../config/env.config.js";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html, adminId } = job.data;

    // 1. Send the actual email
    await transporter.sendMail({
      from: `"Workspace" <${env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });

    // 2. Notify frontend of individual success
    const io = getSocketIoInstance();
    if (io && adminId) {
      io.to(adminId).emit("invite_progress", {
        email: to,
        status: "Success",
      });
    }
  },
  {
    connection: redisClient,
    limiter: { max: 5, duration: 1000 },
  },
);

// --- Event Listeners ---
emailWorker.on("completed", async (job) => {
  logger.info(`Successfully sent email to ${job.data.to}`);
  // Pass null because there is no failed email
  await checkBatchCompletion(job.data.batchId, job.data.adminId, null);
});

emailWorker.on("failed", async (job, err) => {
  logger.warn(
    `Attempt ${job.attemptsMade} failed for ${job.data.to}: ${err.message}`,
  );

  // run out of retries that is this attempt 3 out of 3 had done and still failed,
  // then we consider it a permanent failure and notify the frontend
  if (job.attemptsMade >= job.opts.attempts) {
    logger.error(
      `PERMANENT FAILURE for ${job.data.to} after ${job.attemptsMade} attempts.`,
    );

    // 1. Notify frontend of the individual failure
    const io = getSocketIoInstance();
    if (io && job.data.adminId) {
      io.to(job.data.adminId).emit("invite_progress", {
        email: job.data.to,
        status: "Failed",
        message: "Failed after 3 attempts.",
      });
    }

    // 2. Trigger the batch counter, passing the specific email that failed!
    await checkBatchCompletion(job.data.batchId, job.data.adminId, job.data.to);
  }
});

export default emailWorker;
