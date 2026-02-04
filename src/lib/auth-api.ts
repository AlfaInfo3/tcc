
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Checks if the request is authenticated as an admin.
 * Verifies the existence of 'admin_token' cookie.
 * 
 * Usage:
 * if (!await isAuthenticated()) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 */
export async function isAuthenticated(req?: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token;
}
