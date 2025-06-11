import crypto from "node:crypto";
import database from "infra/database";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 days

async function create(userID) {
  const token = crypto.randomBytes(48).toString("hex");

  const currentTimestamp = Date.now();
  const createdAt = new Date(currentTimestamp);
  const expiresAt = new Date(currentTimestamp + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userID, createdAt, expiresAt);
  return newSession;

  async function runInsertQuery(token, userID, createdAt, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          sessions (token, user_id, created_at, expires_at)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      ;`,
      values: [token, userID, createdAt, expiresAt],
    });

    return results.rows[0];
  }
}

const session = { create, EXPIRATION_IN_MILLISECONDS };

export default session;
