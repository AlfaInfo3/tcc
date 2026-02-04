import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { studentId, bookId, days, type } = await request.json();

    if (!studentId || !bookId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // 1. Transaction to ensure book availability
    const result = await prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({ where: { id: bookId } });
        if (!book || book.quantity < 1) {
            throw new Error('Livro indisponível');
        }

        // Decrement Quantity
        await tx.book.update({
            where: { id: bookId },
            data: { quantity: { decrement: 1 } }
        });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (days || 14));

        return tx.loan.create({
            data: {
                studentId,
                bookId,
                status: 'active',
                loanType: type || 'local',
                dueDate
            }
        });
    });

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar empréstimo' }, { status: 500 });
  }
}
