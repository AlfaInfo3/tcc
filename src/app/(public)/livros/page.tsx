// src/app/(public)/livros/page.tsx
import PublicBookList from '@/components/books/PublicBookList';
import { GenreFilter } from '@/components/books/GenreFilter';
import { SearchInput } from '@/components/books/SearchInput';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; 

async function getBooks(genre?: string, query?: string) {
  const where: any = {};
  
  if (genre) {
    where.genres = { has: genre };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { author: { contains: query, mode: 'insensitive' } },
    ];
  }

  return prisma.book.findMany({
    where,
    orderBy: { title: 'asc' }
  });
}

async function getGenres() {
    // For arrays, prisma distinct works on the whole array combination.
    // To get all unique individual tags, we fetches all (optimized with select).
    const result = await prisma.book.findMany({
        select: { genres: true },
    });
    
    // Flatten and unique
    const allTags = result.flatMap(r => r.genres);
    return Array.from(new Set(allTags)).sort();
}

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ genre?: string; q?: string }> }) {
  const params = await searchParams;
  const genre = params.genre;
  const query = params.q;

  const [books, genres] = await Promise.all([
      getBooks(genre, query),
      getGenres()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todos os Livros</h1>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
             <SearchInput />
          </div>
      </div>
      
      <GenreFilter genres={genres} />

      <PublicBookList books={books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author || 'Desconhecido',
        coverUrl: b.coverUrl || '',
        description: b.description || '',
        genres: b.genres, 
        publishedAt: b.publishedAt || undefined,
        quantity: b.quantity,
        createdAt: b.createdAt.toISOString()
      }))} />
    </div>
  );
}