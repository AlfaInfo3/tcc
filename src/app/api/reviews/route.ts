import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: 'ID do livro é obrigatório' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 5.0;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return NextResponse.json({ error: 'Erro ao carregar avaliações' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, studentName, studentClass, rating, comment } = body;

    if (!bookId || typeof bookId !== 'string') {
      return NextResponse.json({ error: 'Livro inválido' }, { status: 400 });
    }

    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return NextResponse.json({ error: 'Informe seu nome completo (mínimo 2 letras)' }, { status: 400 });
    }

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'A nota deve ser entre 1 e 5 estrelas' }, { status: 400 });
    }

    // Check if book exists
    const bookExists = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    });

    if (!bookExists) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }

    const cleanName = sanitizeText(studentName).slice(0, 80);
    const cleanClass = studentClass && typeof studentClass === 'string' 
      ? sanitizeText(studentClass).slice(0, 50) 
      : null;
    const cleanComment = comment && typeof comment === 'string' 
      ? sanitizeText(comment).slice(0, 1000) 
      : null;

    const newReview = await prisma.review.create({
      data: {
        bookId,
        studentName: cleanName,
        studentClass: cleanClass,
        rating: parsedRating,
        comment: cleanComment,
      },
    });

    // Recompute stats
    const allReviews = await prisma.review.findMany({
      where: { bookId },
      select: { rating: true },
    });

    const total = allReviews.length;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / total).toFixed(1));

    return NextResponse.json({
      success: true,
      review: newReview,
      stats: {
        totalReviews: total,
        averageRating,
      },
      message: 'Sua avaliação foi publicada com sucesso!',
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return NextResponse.json({ error: 'Não foi possível salvar sua avaliação. Tente novamente.' }, { status: 500 });
  }
}
