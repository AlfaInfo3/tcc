import { prisma } from '@/lib/prisma';
import { AdminLivrosClientView, AdminBookItem } from './AdminLivrosClientView';

// Force dynamic since we query DB
export const dynamic = 'force-dynamic';

async function getBooks(query?: string) {
  const where = query ? {
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { author: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  return prisma.book.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminBooksPage(props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const books = await getBooks(query);

  const initialBooks: AdminBookItem[] = books.map((book) => ({
    ...book,
    author: book.author || 'Desconhecido',
    coverUrl: book.coverUrl || '',
    publishedAt: book.publishedAt || undefined,
    description: book.description || undefined,
    genres: book.genres || [],
    createdAt: book.createdAt.toISOString()
  }));

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4">
      <AdminLivrosClientView initialBooks={initialBooks} />
    </div>
  );
}

