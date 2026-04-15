'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface GenreFilterProps {
  genres: string[];
}

export function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre');

  const handleSelect = (genre: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genre) {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }
    router.push(`/livros?${params.toString()}`);
  };

  if (genres.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !currentGenre
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        Todos
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleSelect(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentGenre === genre
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
