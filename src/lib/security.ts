import crypto from 'crypto';

interface SessionPayload {
  sub: string;
  role: 'admin' | 'student';
  exp: number; // Unix timestamp in seconds
  iat: number; // Unix timestamp in seconds
}

// In production, SESSION_SECRET should be set in .env.
// In development, provide a stable fallback secret so dev sessions function smoothly.
const SECRET = process.env.SESSION_SECRET || 'dev-insecure-secret-key-change-in-production-min32chars';

/**
 * Creates a cryptographically signed session token (HMAC-SHA256).
 * Format: base64url(payload).signature
 */
export function createSignedSessionToken(
  subjectId: string,
  role: 'admin' | 'student',
  expiresInSeconds: number = 7 * 24 * 60 * 60 // 7 days
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: subjectId,
    role,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifies a cryptographically signed session token.
 * Validates HMAC-SHA256 signature, expiry time, and role.
 */
export function verifySignedSessionToken(
  token: string | undefined | null,
  expectedRole?: 'admin' | 'student'
): { valid: boolean; payload?: SessionPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing or invalid' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [payloadEncoded, signature] = parts;

  // Verify HMAC signature using timingSafeEqual to protect against timing attacks
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadEncoded)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payloadJson = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    if (expectedRole && payload.role !== expectedRole) {
      return { valid: false, error: `Unauthorized role: expected ${expectedRole}` };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Invalid token payload' };
  }
}
