import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  return NextResponse.json({ userId: session.userId, role: session.role });
}
