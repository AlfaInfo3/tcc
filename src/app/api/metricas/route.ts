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
    // Get counts for different metrics
    const totalBooks = await prisma.book.count();
    const totalLoans = await prisma.loan.count();
    const activeLoans = await prisma.loan.count({
      where: { status: 'active' }
    });

    // Calculate overdue loans (loans that are active but past due date)
    const overdueLoans = await prisma.loan.count({
      where: {
        status: 'active',
        dueDate: { lt: new Date() }
      }
    });

    const reservations = await prisma.reservation.count();

    // Get most popular books based on number of loans
    const mostPopularBooks = await prisma.book.groupBy({
      by: ['id', 'title'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5,
      where: {
        loans: {
          some: {}
        }
      }
    }).then(results =>
      results.map(result => ({
        id: result.id,
        title: result.title,
        loans: result._count.id
      }))
    );

    // Aggregations for more accurate numbers
    const totalBooksAggregation = await prisma.book.aggregate({
      _sum: {
        quantity: true
      }
    });

    const activeLoansCount = await prisma.loan.count({
      where: { status: 'active' }
    });

    const availableBooks = totalBooksAggregation._sum.quantity || 0;
    const totalItems = availableBooks + activeLoansCount;

    const metrics = {
      totalTitles: totalBooks, // Distinct book titles
      totalItems: totalItems, // Total physical copies (in stock + borrowed)
      availableBooks: availableBooks, // Currently on shelf
      borrowedBooks: activeLoansCount,
      totalLoans,
      activeLoans: activeLoansCount,
      overdueLoans,
      reservations,
      mostPopularBooks
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}