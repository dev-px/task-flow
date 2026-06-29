import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOCAL_MONGO_URL: process.env.LOCAL_MONGO_URL,
  PROD_MONGO_URL: process.env.PROD_MONGO_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  PROD_REDIS_URL: process.env.PROD_REDIS_URL,
  LOCAL_REDIS_URL: process.env.LOCAL_REDIS_URL,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
  VERSION: process.env.VERSION,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default env;
