import logger from "../config/logger.config.js";
import "./email.worker.js";
import "./organization.worker.js";

logger.info("Background Workers initialized and actively listening to Redis...");