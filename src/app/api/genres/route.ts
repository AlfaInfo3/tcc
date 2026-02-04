import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await prisma.book.findMany({
      select: { genres: true },
    });

    const allGenres = result.flatMap(r => r.genres);
    const genres = Array.from(new Set(allGenres)).sort();

    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json([], { status: 500 });
  }
}
