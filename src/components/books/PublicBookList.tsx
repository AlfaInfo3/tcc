'use client';

import { BookCard } from '@/components/books/book-card';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';

interface PublicBookListProps {
  books: Book[];
}

export default function PublicBookList({ books }: PublicBookListProps) {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReserve = (bookId: string | number) => {
    router.push(`/livros/${bookId}`);
  };

  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach(book => {
      book.genres?.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesGenre = selectedGenre ? book.genres?.includes(selectedGenre) : true;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [books, selectedGenre, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
             <input
                type="text"
                placeholder="Buscar por título, autor ou ISBN..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             {searchQuery && (
                <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X size={14} />
                </button>
             )}
        </div>

        {/* Genre Filters */}
        {uniqueGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Filter size={16} className="text-muted-foreground" />
            <Badge
              variant={selectedGenre === null ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedGenre(null)}
            >
              Todos
            </Badge>
            {uniqueGenres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              >
                {genre}
              </Badge>
            ))}
            {selectedGenre && (
                <button
                    onClick={() => setSelectedGenre(null)}
                    className="text-xs text-muted-foreground hover:text-red-500 ml-2 flex items-center transition-colors"
                >
                    <X size={12} className="mr-1" />
                    Limpar
                </button>
            )}
          </div>
        )}
      </div>

      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-xl border border-border border-dashed">
             <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3 flex items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6" />
            </div>
             <h3 className="text-lg font-medium text-foreground">Nenhum livro encontrado</h3>
             <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">Não há livros disponíveis ou sua busca não retornou resultados.</p>
            {(selectedGenre || searchQuery) && (
                <button
                    onClick={() => {setSelectedGenre(null); setSearchQuery('');}}
                    className="mt-4 text-primary hover:underline text-sm font-medium"
                >
                    Limpar todos os filtros
                </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onReserve={handleReserve}
            />
          ))}
        </div>
      )}
    </div>
  );
}
