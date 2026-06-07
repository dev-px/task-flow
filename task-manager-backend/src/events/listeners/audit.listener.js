import logger from "../../config/logger.config.js";
import { EVENTS, systemEvents } from "../eventBus.js";
import { createAuditLog } from "./../../modules/audit/audit.service.js";

systemEvents.on(EVENTS.AUDIT_LOG_TRIGGERED, async (payload) => {
  try {
    // When it hears the event, it writes to the database
    await createAuditLog(payload);
  } catch (error) {
    logger.error("[Event Listener] Audit Log Failed to save:", error);
  }
});

export const initializeListeners = () => {
  logger.info("Event Listeners initialized.");
};
