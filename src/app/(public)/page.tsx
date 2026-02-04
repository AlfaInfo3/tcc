// src/app/(public)/page.tsx
import PublicBookList from '@/components/books/PublicBookList';
import { prisma } from '@/lib/prisma';

// Revalidate cache every hour
export const revalidate = 3600;

async function getBooks() {
  return prisma.book.findMany();
}

export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo de Livros</h1>
      
      <PublicBookList books={books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author || 'Desconhecido',
        coverUrl: b.coverUrl || '',
        description: b.description || '',
        publishedAt: b.publishedAt || undefined,
        quantity: b.quantity,
        createdAt: b.createdAt.toISOString()
      }))} />
    </div>
  );
}