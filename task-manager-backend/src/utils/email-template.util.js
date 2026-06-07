import env from "../config/env.config.js";

export const buildInviteEmail = (token) => {
  const inviteLink = `${env.SERVER_URL}/api/${env.VERSION}/member/verify-invite?token=${token}`;
  return {
    subject: "You have been invited to join the workspace!",
    html: `
      <h2>Welcome to the Team!</h2>
      <p>Click the link below to set up your account. This link expires in 48 hours.</p>
      <a href="${inviteLink}">Accept Invitation</a>
    `,
  };
};

export const buildPasswordResetEmail = (resetToken) => {
  const resetLink = `${env.SERVER_URL}/api/${env.VERSION}/reset-password?token=${resetToken}`;
  return {
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click below to reset your password. If you didn't request this, ignore this email.</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  };
};
