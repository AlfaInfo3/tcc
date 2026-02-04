
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch pending reservations (Solicitações)
    const reservations = await prisma.reservation.findMany({
      where: {
        status: 'reserved'
      },
      include: {
        book: true,
        student: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // 2. Fetch active loans (Emprestados)
    const activeLoans = await prisma.loan.findMany({
      where: {
        status: 'active'
      },
      include: {
        book: true,
        student: true
      },
      orderBy: {
        loanDate: 'desc'
      }
    });

    // 3. Fetch returned loans (Devolvidos) - Limit to last 50 for performance
    const returnedLoans = await prisma.loan.findMany({
      where: {
        status: 'returned'
      },
      include: {
        book: true,
        student: true
      },
      orderBy: {
        returnDate: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      reservations,
      activeLoans,
      returnedLoans
    });
  } catch (error) {
    console.error('Error fetching kanban data:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do quadro' },
      { status: 500 }
    );
  }
}
