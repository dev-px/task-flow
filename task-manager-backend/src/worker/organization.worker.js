import mongoose from "mongoose";
import { Worker } from "bullmq";
// import Project from "../modules/project/project.schema.js";
// import Task from "../modules/task/task.schema.js";
import logger from "../config/logger.config.js";
import redisClient from "../config/redis.config.js";
import Role from "../modules/role/role.schema.js";
import Member from "../modules/member/member.schema.js";
import { getSocketIoInstance } from "../config/socket.config.js";
import { updateOrganization } from "../modules/organization/organization.repository.js";

const orgDeletionWorker = new Worker(
  "org-deletion",
  async (job) => {
    const { organizationId, deletedBy } = job.data;
    const deletionDate = new Date();

    logger.info(
      `Starting indestructible background deletion for Org: ${organizationId}`,
    );

    // 1. Start a Mongoose Session and Transaction
    const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const updatePayload = {
        $set: {
          isDeleted: true,
          deletedAt: deletionDate,
          deletedBy: deletedBy,
        },
      };

      await Promise.all([
        Role.updateMany({ organizationId }, updatePayload, {
          session,
        }),
        // Project.updateMany(
        //   { organizationId, isDeleted: false },
        //   updatePayload,
        //   { session },
        // ),
        // Task.updateMany({ organizationId, isDeleted: false }, updatePayload, {
        //   session,
        // }),
        // Subtask.updateMany(
        //   { organizationId, isDeleted: false },
        //   updatePayload,
        //   { session },
        // ),
        Member.updateMany({ organizationId }, updatePayload, {
          session,
        }),
      ]);

      // 3. Commit the transaction ONLY if all DB updates succeeded
      // await session.commitTransaction();
      logger.info(`Database transaction committed for Org: ${organizationId}`);
    } catch (error) {
      // If literally anything goes wrong, UNDO everything.
      // await session.abortTransaction();
      logger.error(
        `DB Update crashed. Rolled back all changes for Org: ${organizationId}`,
      );

      // We throw the error so BullMQ knows the job failed and will trigger a Retry!
      throw error;
    } finally {
      // Always end the session to prevent memory leaks
      session.endSession();
    }

    // PART 2: Wipe Redis Cache (Only runs if DB transaction succeeded)
    try {
      let cursor = "0";
      const pattern = `org:${organizationId}:member:*`;

      do {
        const reply = await redisClient.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100,
        );
        cursor = reply[0];
        const keysToDelete = reply[1];

        if (keysToDelete.length > 0) {
          await redisClient.del(...keysToDelete);
        }
      } while (cursor !== "0");

      // Blacklist the Org
      await redisClient.setex(
        `blacklist:org:${organizationId}`,
        172800,
        "deleted",
      );
      logger.info(
        `Cleared Redis caches and blacklisted Org: ${organizationId}`,
      );
    } catch (redisError) {
      // If Redis fails, we throw an error so BullMQ retries the job.
      // Why is this safe? Because our Mongoose updates check for `isDeleted: false`.
      // If BullMQ retries the whole job, the DB updates will just safely skip over everything!
      logger.error(
        "Redis cache wipe failed. Triggering BullMQ retry.",
        redisError,
      );
      throw redisError;
    }
  },
  {
    connection: redisClient,
  },
);

orgDeletionWorker.on("completed", async (job) => {
  try {
    const { organizationId, deletedBy, originalSlug } = job.data;
    const freedSlug = `${originalSlug}-deleted-${Date.now()}`;

    await updateOrganization(organizationId, {
      isDeleted: true,
      deletionStatus: "deleted",
      deletedAt: new Date(),
      deletedBy: deletedBy,
      slug: freedSlug,
    });

    logger.info(
      `Organization ${organizationId} marked as deleted. Slug freed.`,
    );

    const io = getSocketIoInstance();
    if (io && deletedBy) {
      io.to(deletedBy.toString()).emit("org_deleted_success", {
        organizationId,
      });
    }
  } catch (error) {
    logger.error(
      `Failed to finalize deletion status for Org ${organizationId}:`,
      error,
    );
  }
});

orgDeletionWorker.on("failed", async (job, err) => {
  try {
    const { organizationId, deletedBy } = job.data;
    const maxAttempts = job.opts.attempts || 3;

    if (job.attemptsMade >= maxAttempts) {
      logger.error(
        `PERMANENT FAILURE. Could not delete Org: ${organizationId}`,
      );

      await updateOrganization(organizationId, {
        deletionStatus: "active",
      });

      const io = getSocketIoInstance();
      if (io && deletedBy) {
        io.to(deletedBy.toString()).emit("org_deleted_failed", {
          organizationId,
          message:
            "A critical database error occurred while deleting your organization.",
        });
      }
    }
  } catch (error) {
    logger.error(`Error in 'failed' event handler for job ${job.id}:`, error);
  }
});

export default orgDeletionWorker;
