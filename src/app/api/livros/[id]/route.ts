import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id }
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { isAuthenticated } from '@/lib/auth-api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Use transaction to ensure cascade delete or consistent state
    await prisma.$transaction(async (tx) => {
        // 1. Delete dependent Reservations
        await tx.reservation.deleteMany({
            where: { bookId: id }
        });

        // 2. Delete dependent Loans
        await tx.loan.deleteMany({
            where: { bookId: id }
        });

        // 3. Delete the Book
        await tx.book.delete({
            where: { id }
        });
    });

    revalidateTag('public-books', 'default');
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Erro ao excluir livro e seus registros associados.' }, { status: 500 });
  }
}
