import crypto from "crypto";

// Only the hash is ever stored - the raw token is emailed once and never
// persisted, so a DB leak alone can't be used to reset anyone's password.
export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
