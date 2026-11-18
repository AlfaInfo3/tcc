import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

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

    revalidateTag('public-books', 'default');
    return NextResponse.json(result);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar empréstimo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
