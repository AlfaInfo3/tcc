import { prisma } from '@/lib/prisma';
import { BookCard } from '@/components/books/book-card';
import Link from 'next/link';

// Force dynamic since we query DB
export const dynamic = 'force-dynamic';

async function getBooks() {
  return prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminBooksPage() {
  const books = await getBooks();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Livros</h1>
        <Link 
          href="/admin/livros/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Adicionar Livro
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard 
             key={book.id} 
             book={{
                 ...book, 
                 author: book.author || 'Desconhecido', 
                 coverUrl: book.coverUrl || '',
                 publishedAt: book.publishedAt || undefined,
                 description: book.description || undefined,
                 genre: book.genre || undefined,
                 createdAt: book.createdAt.toISOString()
             }} 
             adminMode 
          />
        ))}
        {books.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-12">
            Nenhum livro cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
