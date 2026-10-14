"use client";

import Link from 'next/link';
import { Book } from '@/types/book';
import { ModernBookCover, BookHeader, BookTitle, BookDescription } from '@/cuicui/other/books/modern-book-cover/modern-book-cover';
import { Book as BookIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BookCardProps {
  book: Omit<Book, 'id'> & { id: string | number };
  onReserve?: (bookId: string | number) => void;
  adminMode?: boolean;
}

export function BookCard({ book, onReserve, adminMode }: BookCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAvailable = book.quantity > 0;
  
  // Consistent color mapping based on title
  const colors = ["neutral", "blue", "amber", "red", "green", "purple", "slate", "zinc"] as const;
  const colorIndex = (book.title || 'A').charCodeAt(0) % colors.length;
  const bookColor = colors[colorIndex];

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
    }, 450); // Wait for 3D rotation animation before route transition
  };

  const href = adminMode ? `/admin/livros/${book.id}` : `/livros/${book.id}`;

  return (
    <div className="flex flex-col items-center group/card h-full w-full select-none">
      <Link href={href} onClick={(e) => handleCardClick(e, href)} className="shrink-0 relative">
        <div className="relative transform transition-transform duration-300 group-hover/card:-translate-y-2">
          
          {/* Desktop 3D cover (size md = 160px width) */}
          <div className="hidden sm:block">
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
          </div>

          {/* Mobile 3D cover (size sm = 135px width, fits 2-column mobile screens without overflow) */}
          <div className="block sm:hidden">
            <ModernBookCover
              size="sm"
              color={bookColor}
              coverImage={book.coverUrl}
              forceRotate={isNavigating}
            >
              <BookHeader>
                <BookIcon size={16} />
              </BookHeader>
              <BookTitle className="text-sm leading-tight">{book.title}</BookTitle>
              <BookDescription className="text-[10px] line-clamp-2">{book.author}</BookDescription>
            </ModernBookCover>
          </div>
        </div>
      </Link>

      <div className="mt-3 w-full max-w-[140px] sm:max-w-[160px] flex flex-col flex-1 text-center">
        <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 text-slate-800 h-9 sm:h-10 flex items-center justify-center mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 truncate mb-1.5 font-medium">
          {book.author || 'Autor não informado'}
        </p>

        {/* Badges de Disponibilidade e Gênero */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            isAvailable 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isAvailable ? `${book.quantity} disp.` : 'Indisp.'}
          </span>
          {book.genres && book.genres.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-800 truncate max-w-[90px] border border-blue-200">
              {book.genres[0]}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1 w-full">
          {onReserve && (
            <button
              type="button"
              onClick={() => onReserve(book.id)}
              disabled={!isAvailable}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {isAvailable ? 'Reservar' : 'Indisponível'}
            </button>
          )}
          
          {adminMode && (
            <Link
              href={`/admin/livros/${book.id}`}
              className="block w-full py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 mt-2 transition-colors text-center"
            >
              Editar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
