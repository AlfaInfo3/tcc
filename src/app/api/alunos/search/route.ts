import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const students = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { class: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 10,
    orderBy: { name: 'asc' }
  });

  return NextResponse.json(students);
}
