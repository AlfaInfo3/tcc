export interface SessionPayload {
  sub: string;
  role: 'admin' | 'student';
  exp: number; // Unix timestamp in seconds
  iat: number; // Unix timestamp in seconds
}

const DEV_FALLBACK_SECRET = 'dev-insecure-secret-key-change-in-production-min32chars';

/**
 * Resolves the signing secret for session tokens.
 *
 * - In production a real secret is mandatory (>= 32 chars) and an error is
 *   thrown otherwise, so sessions can never be signed with a public fallback.
 * - In development a stable fallback keeps local sessions working smoothly.
 *
 * This module intentionally has no Node.js imports so it can be shared by the
 * Edge middleware and the Node runtime.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 32) {
      throw new Error(
        'SESSION_SECRET is required in production and must be at least 32 characters long.'
      );
    }
    return secret;
  }

  return secret && secret.length > 0 ? secret : DEV_FALLBACK_SECRET;
}
