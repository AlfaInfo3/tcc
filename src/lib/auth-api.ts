import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifySignedSessionToken } from './security';
import { prisma } from './prisma';

/**
 * Checks if the incoming request is authenticated as an admin.
 * Cryptographically verifies 'admin_token' signature and active status.
 *
 * Usage:
 * if (!await isAuthenticated(request)) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 */
export async function isAuthenticated(req?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('admin_token')?.value;
  }

  if (!token) {
    return false;
  }

  // 1. Verify cryptographic session token
  const verification = verifySignedSessionToken(token, 'admin');
  if (verification.valid && verification.payload) {
    // Verify that the user still exists and isActive in database
    try {
      const user = await prisma.adminUser.findUnique({
        where: { id: verification.payload.sub, isActive: true },
        select: { id: true, role: true }
      });
      return !!user;
    } catch {
      // In case database connection fails or fallback
      return false;
    }
  }

  return false;
}
