import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const LEGACY_SHA256_REGEX = /^[a-f0-9]{64}$/i;

/** True when the stored hash is a legacy unsalted SHA-256 hex digest. */
export function isLegacySha256Hash(hash: string): boolean {
  return LEGACY_SHA256_REGEX.test(hash);
}

/** Legacy digest, kept only to validate passwords created before the migration. */
export function legacySha256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/** Hash a password with bcrypt. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a stored hash.
 *
 * Supports legacy SHA-256 hashes so existing students can still log in. When a
 * legacy hash matches, `needsRehash` is true and the caller should persist a
 * fresh bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (isLegacySha256Hash(storedHash)) {
    return { valid: legacySha256(password) === storedHash, needsRehash: true };
  }

  return { valid: await bcrypt.compare(password, storedHash), needsRehash: false };
}
