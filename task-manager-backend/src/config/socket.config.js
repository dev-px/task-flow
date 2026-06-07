import { Server } from "socket.io";
import logger from "./logger.config.js";
import env from "./env.config.js";

let io;

const initializeSocket = (httpServer) => {
  // initialize the Socket.io server
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
    },
  });

  // lListen for connections
  io.on("connection", (socket) => {
    // When a user logs in on the frontend, they should emit a "join" event with their userId
    socket.on("join_admin_room", (adminId) => {
      socket.join(adminId);
      logger.info(`Admin ${adminId} connected to real-time updates.`);
    });

    socket.on("disconnect", () => {
      logger.info("User disconnected from socket.");
    });
  });

  return io;
};

const getSocketIoInstance = () => {
  if (!io) {
    logger.warn("Socket.io has not been initialized yet!");
  }
  return io;
};

export { initializeSocket, getSocketIoInstance };
