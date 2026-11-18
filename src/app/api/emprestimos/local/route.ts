import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-api';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.bookId || !body.studentId) {
      return NextResponse.json({ error: 'Book ID and Student ID are required' }, { status: 400 });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Check if book exists and has available stock
    const book = await prisma.book.findUnique({
      where: { id: body.bookId }
    });

    if (!book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }

    if (book.quantity <= 0) {
      return NextResponse.json({ error: 'Livro indisponível (estoque esgotado)' }, { status: 409 });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: body.studentId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    // Use transaction to ensure data integrity
    const newLoan = await prisma.$transaction(async (tx) => {
      // 1. Create the loan
      const loan = await tx.loan.create({
        data: {
          bookId: body.bookId,
          studentId: body.studentId,
          loanType: 'local',
          status: 'active',
          dueDate: dueDate
        },
        include: {
          book: true,
          student: true
        }
      });

      // 2. Decrease book stock
      await tx.book.update({
        where: { id: body.bookId },
        data: {
          quantity: {
            decrement: 1
          }
        }
      });

      return loan;
    });

    revalidateTag('public-books', 'default');
    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    console.error('Error creating local loan:', error);
    return NextResponse.json({ error: 'Failed to create local loan' }, { status: 500 });
  }
}