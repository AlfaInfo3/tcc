import { NextRequest } from 'next/server';
import { verifySignedSessionToken } from './security';

/**
 * Authentication check for admin routes.
 * Cryptographically verifies admin session token and redirects to login if invalid.
 */
export function requireAuth(request: NextRequest): { authenticated: boolean; redirect?: string; userId?: string } {
  const authHeader = request.headers.get('Authorization');
  let token = request.cookies.get('admin_token')?.value;

  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return { authenticated: false, redirect: '/admin/auth' };
  }

  const verification = verifySignedSessionToken(token, 'admin');
  if (verification.valid && verification.payload) {
    return { authenticated: true, userId: verification.payload.sub };
  }

  return { authenticated: false, redirect: '/admin/auth' };
}