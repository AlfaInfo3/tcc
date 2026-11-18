import { prisma } from '@/lib/prisma';

export interface DashboardMetricsData {
  totalTitles: number;
  totalItems: number;
  availableBooks: number;
  borrowedBooks: number;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
  reservations: number;
  mostPopularBooks: Array<{ id: string; title: string; loans: number }>;
}

export interface KanbanBook {
  title: string | null;
}

export interface KanbanStudent {
  name: string;
}

export interface KanbanReservation {
  id: string;
  bookId: string;
  studentId: string;
  createdAt: string;
  loanType?: string | null;
  book?: KanbanBook | null;
  student?: KanbanStudent | null;
}

export interface KanbanLoan {
  id: string;
  bookId: string;
  studentId: string;
  dueDate: string;
  loanDate: string;
  returnDate?: string | null;
  loanType?: string | null;
  book?: KanbanBook | null;
  student?: KanbanStudent | null;
}

export interface KanbanApiData {
  reservations: KanbanReservation[];
  activeLoans: KanbanLoan[];
  returnedLoans: KanbanLoan[];
}

export async function getDashboardMetrics(): Promise<DashboardMetricsData> {
  const now = new Date();

  const [
    totalTitles,
    copiesAggregation,
    totalLoans,
    activeLoans,
    overdueLoans,
    reservations,
    popularGroups,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.book.aggregate({ _sum: { quantity: true } }),
    prisma.loan.count(),
    prisma.loan.count({ where: { status: 'active' } }),
    prisma.loan.count({
      where: {
        OR: [
          { status: 'overdue' },
          { status: 'active', dueDate: { lt: now } },
        ],
      },
    }),
    prisma.reservation.count({ where: { status: 'reserved' } }),
    prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
      take: 5,
    }),
  ]);

  const totalItems = copiesAggregation._sum.quantity ?? 0;
  const popularTitles = await prisma.book.findMany({
    where: { id: { in: popularGroups.map((group) => group.bookId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(popularTitles.map((book) => [book.id, book.title]));

  return {
    totalTitles,
    totalItems,
    availableBooks: Math.max(0, totalItems - activeLoans - reservations),
    borrowedBooks: activeLoans,
    totalLoans,
    activeLoans,
    overdueLoans,
    reservations,
    mostPopularBooks: popularGroups.map((group) => ({
      id: group.bookId,
      title: titleById.get(group.bookId) || 'Título removido',
      loans: group._count.bookId,
    })),
  };
}

function serializeLoan(loan: {
  id: string;
  bookId: string;
  studentId: string;
  dueDate: Date;
  loanDate: Date;
  returnDate: Date | null;
  loanType: string | null;
  book: { title: string } | null;
  student: { name: string } | null;
}): KanbanLoan {
  return {
    ...loan,
    dueDate: loan.dueDate.toISOString(),
    loanDate: loan.loanDate.toISOString(),
    returnDate: loan.returnDate?.toISOString() ?? null,
  };
}

export async function getKanbanData(): Promise<KanbanApiData> {
  const [reservations, activeLoans, returnedLoans] = await Promise.all([
    prisma.reservation.findMany({
      where: { status: 'reserved' },
      include: { book: true, student: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.loan.findMany({
      where: { status: 'active' },
      include: { book: true, student: true },
      orderBy: { loanDate: 'desc' },
    }),
    prisma.loan.findMany({
      where: { status: 'returned' },
      include: { book: true, student: true },
      orderBy: { returnDate: 'desc' },
      take: 5,
    }),
  ]);

  return {
    reservations: reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
    })),
    activeLoans: activeLoans.map(serializeLoan),
    returnedLoans: returnedLoans.map(serializeLoan),
  };
}
