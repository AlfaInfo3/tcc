import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditBookClientView, BookData } from './EditBookClientView';

export const dynamic = 'force-dynamic';

export default async function EditBookPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [book, genresResult] = await Promise.all([
    prisma.book.findUnique({
      where: { id }
    }),
    prisma.book.findMany({
      select: { genres: true }
    })
  ]);

  if (!book) {
    notFound();
  }

  const allGenres = genresResult.flatMap((r) => r.genres || []);
  const uniqueGenres = Array.from(new Set(allGenres)).sort();

  const initialBook: BookData = {
    id: book.id,
    title: book.title,
    author: book.author || 'Desconhecido',
    quantity: book.quantity,
    coverUrl: book.coverUrl || undefined,
    genres: book.genres || [],
    description: book.description || undefined,
    publishedAt: book.publishedAt || undefined,
  };

  return (
    <EditBookClientView
      id={id}
      initialBook={initialBook}
      initialGenres={uniqueGenres}
    />
  );
}
