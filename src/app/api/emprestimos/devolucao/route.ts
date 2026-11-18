import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-api';

export async function PUT(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { loanId } = body;

    // Validation
    if (!loanId) {
      return NextResponse.json(
        { error: 'ID do empréstimo é obrigatório' },
        { status: 400 }
      );
    }

    if (typeof loanId !== 'string' || loanId.trim().length === 0) {
      return NextResponse.json(
        { error: 'ID do empréstimo inválido' },
        { status: 400 }
      );
    }

    // Check if loan exists
    const existingLoan = await prisma.loan.findUnique({
      where: { id: loanId }
    });

    if (!existingLoan) {
      return NextResponse.json(
        { error: 'Empréstimo não encontrado' },
        { status: 404 }
      );
    }

    // Check if loan is already returned
    if (existingLoan.status === 'returned') {
      return NextResponse.json(
        { error: 'Este empréstimo já foi marcado como devolvido' },
        { status: 409 }
      );
    }

    // Use transaction to ensure data integrity
    const returnedLoan = await prisma.$transaction(async (tx) => {
      // 1. Update loan status
      const loan = await tx.loan.update({
        where: { id: loanId },
        data: {
          status: 'returned',
          returnDate: new Date()
        },
        include: {
          book: true,
          student: true
        }
      });

      // 2. Increase book stock
      await tx.book.update({
        where: { id: existingLoan.bookId },
        data: {
          quantity: {
            increment: 1
          }
        }
      });

      return loan;
    });

    return NextResponse.json(returnedLoan);
  } catch (error) {
    console.error('Error processing return:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a devolução' },
      { status: 500 }
    );
  }
}