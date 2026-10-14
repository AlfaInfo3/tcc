import { prisma } from '@/lib/prisma';
import { LivrosClientView } from './LivrosClientView';
import { BookItem } from '@/components/faithful-books/BookCardWithHover';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Acervo de Livros',
  description: 'Explore o catálogo completo de obras disponíveis na biblioteca do Colégio Estadual Laurentino Martins.',
};

export default async function LivrosPage() {
  // Direct PostgreSQL query using Prisma
  const rawBooks = await prisma.book.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      loans: {
        where: { status: 'active' }
      },
      reservations: {
        where: { status: 'reserved' }
      },
      reviews: {
        select: { rating: true }
      }
    }
  });

  const books: BookItem[] = rawBooks.map((b) => {
    const activeLoans = b.loans ? b.loans.length : 0;
    const activeRes = b.reservations ? b.reservations.length : 0;
    const available = Math.max(0, b.quantity - activeLoans - activeRes);
    const reviews = (b as any).reviews || [];
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

    return {
      id: b.id,
      title: b.title,
      author: b.author || 'Autor não informado',
      coverUrl: b.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
      description: b.description || 'Livro físico disponível na biblioteca do Colégio Estadual Laurentino Martins.',
      genres: b.genres || [],
      publishedAt: b.publishedAt || (b.createdAt ? new Date(b.createdAt).getFullYear() : 2024),
      quantity: b.quantity,
      availableCopies: available,
      rating: avgRating,
      ratingsCount: totalReviews > 0
        ? `${totalReviews} ${totalReviews === 1 ? 'avaliação' : 'avaliações'}`
        : `${b.quantity} exemplares`,
      createdAt: b.createdAt.toISOString(),
    };
  });

  return <LivrosClientView initialBooks={books} />;
}
