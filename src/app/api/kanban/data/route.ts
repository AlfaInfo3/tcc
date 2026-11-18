import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';
import { getKanbanData } from '@/lib/dashboard-data';

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    return NextResponse.json(await getKanbanData());
  } catch (error) {
    console.error('Error fetching kanban data:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do quadro' }, { status: 500 });
  }
}
