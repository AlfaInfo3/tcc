"use client";
import Link from 'next/link';
import { Book } from '@/types/book';
import { ModernBookCover, BookHeader, BookTitle, BookDescription } from '@/cuicui/other/books/modern-book-cover/modern-book-cover';
import { Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Omit<Book, 'id'> & { id: string | number };
  onReserve?: (bookId: string | number) => void;
  adminMode?: boolean;
}

import { useRouter } from 'next/navigation';
import { useState } from 'react';
// ... other imports

export function BookCard({ book, onReserve, adminMode }: BookCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAvailable = book.quantity > 0;
  
  // Determine color based on genre or random? For now defaulting to a mapping or random.
  // Simple mapping based on first letter of title for consistency
  const colors = ["neutral", "blue", "amber", "red", "green", "purple", "slate", "zinc"] as const;
  const colorIndex = book.title.charCodeAt(0) % colors.length;
  const bookColor = colors[colorIndex];

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsNavigating(true);
      setTimeout(() => {
          router.push(href);
      }, 500); // Wait for animation (400ms) + buffer
  };

  const href = adminMode ? `/admin/livros/${book.id}` : `/livros/${book.id}`;

  return (
    <div className="flex flex-col items-center group h-full">
      <Link href={href} onClick={(e) => handleCardClick(e, href)} className="shrink-0">
        <div className="relative transform transition-transform duration-300 group-hover:-translate-y-2">
            <ModernBookCover
                size="md"
                color={bookColor}
                coverImage={book.coverUrl}
                forceRotate={isNavigating}
            >
                <BookHeader>
                    <BookIcon size={20} />
                </BookHeader>
                <BookTitle>{book.title}</BookTitle>
                <BookDescription>{book.author}</BookDescription>
            </ModernBookCover>
            
            {/* Avaialbility Badge (Floating) */}
            <div className={`absolute top-0 right-0 px-2 py-1 rounded-full text-[10px] font-bold shadow-md z-30 ${
                isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
                {isAvailable ? 'Disp.' : 'Indisp.'}
            </div>
        </div>
      </Link>

      <div className="mt-4 w-full max-w-[160px] flex flex-col flex-1 text-center">
         <h3 className="font-bold text-sm leading-tight line-clamp-2 text-foreground h-10 flex items-center justify-center mb-1" title={book.title}>
            {book.title}
         </h3>
         <p className="text-xs text-muted-foreground truncate mb-2">{book.author}</p>

         {/* Genre Badges (Only displaying the first selected/available one to save vertical space based on user feedback) */}
         {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2 h-5">
                <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground truncate max-w-full border border-border/50">
                    {book.genres[0]}
                </span>
                {book.genres.length > 1 && (
                    <span className="text-[10px] text-muted-foreground">+{book.genres.length - 1}</span>
                )}
            </div>
         )}

         <div className="mt-auto pt-2">
            {onReserve && (
                <button
                    onClick={() => onReserve(book.id)}
                    disabled={!isAvailable}
                    className={`w-full py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isAvailable
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                >
                    {isAvailable ? 'Reservar' : 'Indisponível'}
                </button>
            )}
            
            {adminMode && (
                <Link
                    href={`/admin/livros/${book.id}`}
                    className="block w-full py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-2"
                >
                    Editar
                </Link>
            )}
         </div>
      </div>
    </div>
  );
}
