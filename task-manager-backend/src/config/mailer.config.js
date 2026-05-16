import nodemailer from "nodemailer";
import env from "./env.config.js";
import logger from "./logger.config.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) logger.error("SMTP Connection Error:", error);
  else logger.info("SMTP Server Ready");
});

export default transporter;
