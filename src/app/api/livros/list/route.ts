import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ensure fresh books are always served from the database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar livros' },
      { status: 500 }
    );
  }
}