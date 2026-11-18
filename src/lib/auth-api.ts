import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifySignedSessionToken } from './security';
import { prisma } from './prisma';

export interface AdminSession {
  userId: string;
  role: string;
}

async function resolveAdminToken(req?: NextRequest): Promise<string | undefined> {
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
  }

  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value;
}

/**
 * Validates the admin session token (signature, role, expiry) and confirms the
 * admin still exists and is active in the database.
 *
 * Returns the session ({ userId, role }) or null when unauthorized.
 */
export async function requireAdmin(req?: NextRequest): Promise<AdminSession | null> {
  const token = await resolveAdminToken(req);
  if (!token) return null;

  const verification = verifySignedSessionToken(token, 'admin');
  if (!verification.valid || !verification.payload) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: verification.payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;

    return { userId: user.id, role: user.role };
  } catch {
    return null;
  }
}

/**
 * Boolean compatibility helper built on top of requireAdmin.
 */
export async function isAuthenticated(req?: NextRequest): Promise<boolean> {
  return (await requireAdmin(req)) !== null;
}

/**
 * Validates a student profile session token.
 * Returns the profile id or null when unauthorized.
 */
export async function requireStudent(req?: NextRequest): Promise<{ profileId: string } | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('student_session')?.value;
  }

  if (!token) return null;

  const verification = verifySignedSessionToken(token, 'student');
  if (!verification.valid || !verification.payload) return null;

  return { profileId: verification.payload.sub };
}
