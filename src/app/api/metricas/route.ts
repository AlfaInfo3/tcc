import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-api';

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Counts
    const totalTitles = await prisma.book.count();
    const copiesAggregation = await prisma.book.aggregate({ _sum: { quantity: true } });
    const totalItems = copiesAggregation._sum.quantity ?? 0;

    const totalLoans = await prisma.loan.count();
    const activeLoans = await prisma.loan.count({ where: { status: 'active' } });

    // Overdue = marcado como atrasado ou ativo com devolução vencida
    const overdueLoans = await prisma.loan.count({
      where: {
        OR: [
          { status: 'overdue' },
          { status: 'active', dueDate: { lt: now } },
        ],
      },
    });

    // Reservas que ainda aguardam retirada (não contam histórico)
    const reservations = await prisma.reservation.count({ where: { status: 'reserved' } });

    const borrowedBooks = activeLoans;
    const availableBooks = Math.max(0, totalItems - activeLoans - reservations);

    // Obras mais emprestadas (contagem real por empréstimo)
    const popularGroups = await prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
      take: 5,
    });

    const popularTitles = await prisma.book.findMany({
      where: { id: { in: popularGroups.map((group) => group.bookId) } },
      select: { id: true, title: true },
    });

    const mostPopularBooks = popularGroups.map((group) => ({
      id: group.bookId,
      title: popularTitles.find((book) => book.id === group.bookId)?.title || 'Título removido',
      loans: group._count.bookId,
    }));

    const metrics = {
      totalTitles,
      totalItems,
      availableBooks,
      borrowedBooks,
      totalLoans,
      activeLoans,
      overdueLoans,
      reservations,
      mostPopularBooks,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}