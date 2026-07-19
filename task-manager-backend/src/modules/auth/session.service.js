import redisClient from "../../config/redis.config.js";

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

// Create Session
const createSession = async (userId, sessionId, sessionData) => {
  const redis_session_key = `session:${sessionId}`;
  const redis_user_session_key = `user_sessions:${userId}`;

  await redisClient.set(
    redis_session_key,
    JSON.stringify(sessionData),
    "EX",
    SESSION_TTL,
  );

  await redisClient.sadd(redis_user_session_key, sessionId);
  await redisClient.expire(redis_user_session_key, SESSION_TTL);
};

// Get a specific session's details
const getSession = async (userId, sessionId) => {
  const redis_session_key = `session:${sessionId}`;

  // Changed hget -> get
  // GET only requires the key to fetch the stringified JSON
  const rawSession = await redisClient.get(redis_session_key);

  return rawSession ? JSON.parse(rawSession) : null;
};

// Update session details (e.g., rotating refresh tokens or updating activity)
const updateSession = async (
  userId,
  sessionId,
  sessionData,
  refreshTokenHash,
  metadata,
) => {
  const redis_session_key = `session:${sessionId}`;

  const updatedSession = {
    ...sessionData,
    refreshTokenHash,
    ipAddress: metadata.ipAddress,
    deviceType: metadata.deviceType,
    browser: metadata.browser,
    os: metadata.os,
    location: metadata.location,
    lastActiveAt: new Date().toISOString(),
  };

  await redisClient.set(
    redis_session_key,
    JSON.stringify(updatedSession),
    "EX",
    SESSION_TTL,
  );
};

// Logout One Device: Deletes the specific session data and removes it from the index set
const deleteSession = async (userId, sessionId) => {
  const redis_session_key = `session:${sessionId}`;
  const redis_user_session_key = `user_sessions:${userId}`;

  await Promise.all([
    redisClient.del(redis_session_key),
    redisClient.srem(redis_user_session_key, sessionId),
  ]);
};

// Logout All Devices: Deletes every session payload linked to the user, then drops the set
const deleteAllSessions = async (userId) => {
  const redis_user_session_key = `user_sessions:${userId}`;

  // Fetch all session IDs associated with the user
  const sessionIds = await redisClient.smembers(redis_user_session_key);

  if (sessionIds.length > 0) {
    const sessionKeys = sessionIds.map((id) => `session:${id}`);

    // Delete all actual session records and the index set itself concurrently
    await Promise.all([
      redisClient.del(sessionKeys),
      redisClient.del(redis_user_session_key),
    ]);
  }
};

// Fetch all active sessions with details (for dashboard/security settings tabs)
const getActiveSessions = async (userId) => {
  const redis_user_session_key = `user_sessions:${userId}`;

  // Grab all active IDs from the index set
  const sessionIds = await redisClient.smembers(redis_user_session_key);
  if (!sessionIds || sessionIds.length === 0) {
    return { count: 0, sessions: [] };
  }

  // Fetch all session records simultaneously
  const sessionKeys = sessionIds.map((id) => `session:${id}`);
  const rawSessions = await redisClient.mget(sessionKeys);

  const sessionsList = [];

  // Parse and clean records (dropping security hashes before sending to front-end)
  for (let i = 0; i < rawSessions.length; i++) {
    const rawData = rawSessions[i];
    if (rawData) {
      const data = JSON.parse(rawData);
      sessionsList.push({
        sessionId: sessionIds[i],
        browser: data.browser,
        os: data.os,
        deviceType: data.deviceType,
        ipAddress: data.ipAddress,
        location: data.location,
        loginAt: data.loginAt,
        lastActiveAt: data.lastActiveAt,
      });
    } else {
      // Edge Case: If a single session expired via TTL but remains in the index set, clean it up asynchronously
      redisClient.srem(redis_user_session_key, sessionIds[i]).catch(() => {});
    }
  }

  return {
    count: sessionsList.length,
    sessions: sessionsList,
  };
};

export {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  deleteAllSessions,
  getActiveSessions,
};
