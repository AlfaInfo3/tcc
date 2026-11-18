import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { LivrosClientView } from './LivrosClientView';
import type { BookItem } from '@/components/faithful-books/BookCardWithHover';
import type { Metadata } from 'next';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Acervo de Livros',
  description: 'Explore o catálogo completo de obras disponíveis na biblioteca do Colégio Estadual Laurentino Martins.',
};

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&auto=format&fit=crop&q=60';

/**
 * Catálogo em cache: uma única ida ao banco (4 agregações em paralelo), com
 * payload enxuto. A página é revalidada a cada 30s e invalidada pelas rotas que
 * alteram livros/reservas via `revalidateTag('public-books')`.
 */
const getPublicBooks = unstable_cache(
  async (): Promise<BookItem[]> => {
    const [books, activeLoans, activeReservations, reviews] = await Promise.all([
      prisma.book.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          author: true,
          coverUrl: true,
          description: true,
          genres: true,
          publishedAt: true,
          quantity: true,
          createdAt: true,
          corridor: true,
          shelf: true,
          shelfLevel: true,
        },
      }),
      prisma.loan.groupBy({
        by: ['bookId'],
        where: { status: 'active' },
        _count: { _all: true },
      }),
      prisma.reservation.groupBy({
        by: ['bookId'],
        where: { status: 'reserved' },
        _count: { _all: true },
      }),
      prisma.review.groupBy({
        by: ['bookId'],
        _count: { _all: true },
        _avg: { rating: true },
      }),
    ]);

    const loanCounts = new Map(activeLoans.map((item) => [item.bookId, item._count._all]));
    const reservationCounts = new Map(
      activeReservations.map((item) => [item.bookId, item._count._all])
    );
    const reviewStats = new Map(reviews.map((item) => [item.bookId, item]));

    return books.map((book): BookItem => {
      const usedCopies =
        (loanCounts.get(book.id) ?? 0) + (reservationCounts.get(book.id) ?? 0);
      const stats = reviewStats.get(book.id);
      const totalReviews = stats?._count._all ?? 0;

      return {
        id: book.id,
        title: book.title,
        author: book.author || 'Autor não informado',
        coverUrl: book.coverUrl || FALLBACK_COVER,
        description:
          book.description?.slice(0, 400) ||
          'Livro físico disponível na biblioteca do Colégio Estadual Laurentino Martins.',
        genres: book.genres || [],
        publishedAt: book.publishedAt || book.createdAt.getFullYear(),
        quantity: book.quantity,
        availableCopies: Math.max(0, book.quantity - usedCopies),
        rating: Number(((stats?._avg.rating ?? 4.8) as number).toFixed(1)),
        ratingsCount:
          totalReviews > 0
            ? `${totalReviews} ${totalReviews === 1 ? 'avaliação' : 'avaliações'}`
            : `${book.quantity} exemplares`,
        createdAt: book.createdAt.toISOString(),
        corridor: book.corridor,
        shelf: book.shelf,
        shelfLevel: book.shelfLevel,
      };
    });
  },
  ['public-books-v3'],
  { revalidate: 30, tags: ['public-books'] }
);

export default async function LivrosPage() {
  const books = await getPublicBooks();
  return <LivrosClientView initialBooks={books} />;
}
