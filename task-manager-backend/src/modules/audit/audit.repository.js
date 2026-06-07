import AuditLog from "./audit.schema.js";

const auditLogDB = async () => {
  return await AuditLog.create({
    organizationId,
    actorId,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress,
  });
};

export {auditLogDB};
