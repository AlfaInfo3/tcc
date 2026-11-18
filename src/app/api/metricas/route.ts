import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';
import { getDashboardMetrics } from '@/lib/dashboard-data';

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    return NextResponse.json(await getDashboardMetrics());
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Falha ao carregar métricas' }, { status: 500 });
  }
}
