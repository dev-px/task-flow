import pino from "pino";
import env from "./env.config.js";

const isDevelopment = env.NODE_ENV === "development";

const logger = pino({
  level: isDevelopment ? "debug" : "info",
  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  }),
});

export default logger; // Modern export
