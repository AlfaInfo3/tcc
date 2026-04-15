import { prisma } from '@/lib/prisma';
import { BookCard } from '@/components/books/book-card';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// Force dynamic since we query DB
export const dynamic = 'force-dynamic';

import { SearchInput } from '@/components/ui/search-input';

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
  console.log('Books Search Query:', query);
  const books = await getBooks(query);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
       {/* Header Section */}
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gerenciar Livros
          </h1>
          <p className="text-muted-foreground mt-1">
             Catálogo completo de obras disponíveis na biblioteca.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <Link href="/admin/livros/novo" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg border border-transparent font-medium transition-all shadow-sm">
            <Plus size={18} />
            Adicionar Livro
          </Link>
        </div>
      </div>

       {/* Filters & Search Bar Area */}
       <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchInput placeholder="Buscar por título, autor ou ISBN..." />
        <div className="flex gap-2 w-full sm:w-auto">
            
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard 
             key={book.id} 
             book={{
                 ...book, 
                 author: book.author || 'Desconhecido', 
                 coverUrl: book.coverUrl || '',
                 publishedAt: book.publishedAt || undefined,
                 description: book.description || undefined,
                 genres: book.genres || [],
                 createdAt: book.createdAt.toISOString()
             }} 
             adminMode 
          />
        ))}
        {books.length === 0 && (
           <div className="col-span-full py-16 text-center bg-card rounded-xl border border-border border-dashed">
             <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3 flex items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6" />
            </div>
             <h3 className="text-lg font-medium text-foreground">Nenhum livro encontrado</h3>
             <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">Não há livros cadastrados no sistema ou sua busca não retornou resultados.</p>
              <Link href="/admin/livros/novo" className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:underline">
                 Adicionar o primeiro livro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
