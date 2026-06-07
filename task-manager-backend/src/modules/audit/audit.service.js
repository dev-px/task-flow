import logger from "../../config/logger.config.js";
import { auditLogDB } from "./audit.repository.js";

export const createAuditLog = async ({
  organizationId,
  actorId,
  action,
  entityType,
  entityId,
  metadata = {},
  ipAddress = "unknown",
}) => {
  try {
    const audit = await auditLogDB(
      organizationId,
      actorId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
    );
    logger.info("Log is Auditted", audit);
  } catch (error) {
    logger.error("[Audit Log Failed]:", error);
  }
};
