import { EventEmitter } from "events";
import logger from "../config/logger.config.js";
import env from "../config/env.config.js";
import transporter from "../config/mailer.config.js";

// Initialize the emitter
class EmailEmitter extends EventEmitter {}
export const emailEmitter = new EmailEmitter();

emailEmitter.on("sendInvite", async (payload) => {
  const { to, subject, html } = payload;

  logger.info(`Background task started: Sending email to ${to}...`);

  try {
    const info = await transporter.sendMail({
      from: `"Workspace Admin" <${env.SMTP_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    });

    logger.info(`Email successfully sent to ${to}! Message ID: ${info.messageId}`);
    
    // In future, this is exactly where you will put your Socket.io logic
    // io.to(adminId).emit("notification", { message: `Email sent to ${to}` });

  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
  }
});