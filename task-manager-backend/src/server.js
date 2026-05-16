import http from "http";
import app from "./app.js";
import env from "./config/env.config.js";
import logger from "./config/logger.config.js";
import connectDB from "./config/db.config.js";
import redisClient from "./config/redis.config.js";
import { Server } from "socket.io";
import { initializeSocket } from "./config/socket.config.js";
import "./queues/email.queue.js";

const startServer = async () => {
  try {
    // db connect
    await connectDB();

    // redis connect
    await redisClient.ping();

    const server = http.createServer(app);

    // socket connect
    const io = initializeSocket(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled Rejection:", error);
      process.exit(1);
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
