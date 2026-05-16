// src/config/db.config.js
import mongoose from "mongoose";
import env from "./env.config.js";
import logger from "./logger.config.js";

const connectDB = async () => {
  const mongoURL =
    env.NODE_ENV === "production" ? env.PROD_MONGO_URL : env.LOCAL_MONGO_URL;

  try {
    const connectionInstance = await mongoose.connect(mongoURL);
    logger.info("MongoDB Connected Successfully!");
  } catch (error) {
    logger.error("MongoDB connection failed catastrophically!", error);
    process.exit(1);
  }
};

export default connectDB;
