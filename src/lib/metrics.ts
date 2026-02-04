// Metrics and analytics utilities
import { prisma } from './prisma';

export async function getSystemMetrics() {
  try {
    const totalBooks = await prisma.book.count();
    const totalStudents = await prisma.student.count();
    const totalReservations = await prisma.reservation.count();
    
    const activeReservations = await prisma.reservation.count({
      where: { status: 'reserved' }
    });
    
    // Get most reserved books
    const mostReservedBooks = await prisma.reservation.groupBy({
      by: ['bookId'],
      _count: {
        bookId: true,
      },
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
      take: 5,
    });
    
    // Join with books to get titles
    const bookIds = mostReservedBooks.map(r => r.bookId);
    const booksWithTitles = await prisma.book.findMany({
      where: {
        id: {
          in: bookIds
        }
      },
      select: {
        id: true,
        title: true
      }
    });
    
    const mostPopularBooks = mostReservedBooks.map(r => {
      const book = booksWithTitles.find(b => b.id === r.bookId);
      return {
        id: r.bookId,
        title: book?.title || 'Unknown Title',
        reservations: r._count.bookId
      };
    });

    return {
      totalBooks,
      totalStudents,
      totalReservations,
      activeReservations,
      mostPopularBooks
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw new Error('Failed to fetch system metrics');
  }
}