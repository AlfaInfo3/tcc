'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { Bookmark01Icon, BookOpen01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import Link from 'next/link';
import { Stars } from './Stars';
import { ModernBookCover, BookHeader, BookTitle, BookDescription } from '@/cuicui/other/books/modern-book-cover/modern-book-cover';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genres: string[];
  publishedAt?: number;
  quantity: number;
  availableCopies?: number;
  rating?: number;
  ratingsCount?: string;
  createdAt?: string;
  corridor?: string | null;
  shelf?: string | null;
  shelfLevel?: string | null;
}

interface BookCardWithHoverProps {
  book: BookItem;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onReserve?: (book: BookItem) => void;
}

export function BookCardWithHover({
  book,
  defaultOpen = false,
  open,
  onOpenChange,
  onReserve,
}: BookCardWithHoverProps) {
  const isAvailable = (book.availableCopies ?? book.quantity) > 0;
  const ratingValue = book.rating || 4.8;
  const ratingsCountLabel = book.ratingsCount || `${book.quantity} un. no acervo`;

  // Color theme for book spine/fallback
  const colors = ["blue", "neutral", "amber", "red", "green", "purple", "slate", "zinc"] as const;
  const colorIndex = (book.title || 'A').charCodeAt(0) % colors.length;
  const bookColor = colors[colorIndex];

  const href = `/livros/${book.id}`;

  return (
    <div
      className="flex flex-col items-center group/card w-full select-none pt-2.5"
      onMouseEnter={() => onOpenChange?.(true)}
    >
      <HoverCard.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        openDelay={120}
        closeDelay={60}
      >
        <HoverCard.Trigger asChild>
          <Link
            href={href}
            className="shrink-0 relative block cursor-pointer transition-transform duration-300 group-hover/card:-translate-y-2"
            data-letter={(book.title || 'A').trim()[0]?.toUpperCase() || 'A'}
          >
            {/* ── 3D ROTATING BOOK COVER (DESKTOP: size md = 160px) ── */}
            <div className="hidden sm:block">
              <ModernBookCover
                size="md"
                color={bookColor}
                coverImage={book.coverUrl}
              >
                <BookHeader>
                  <HugeIcon icon={BookOpen01Icon} size={20} />
                </BookHeader>
                <BookTitle>{book.title}</BookTitle>
                <BookDescription>{book.author}</BookDescription>
              </ModernBookCover>
            </div>

            {/* ── 3D ROTATING BOOK COVER (MOBILE: size sm = 135px) ─── */}
            <div className="block sm:hidden">
              <ModernBookCover
                size="sm"
                color={bookColor}
                coverImage={book.coverUrl}
              >
                <BookHeader>
                  <HugeIcon icon={BookOpen01Icon} size={16} />
                </BookHeader>
                <BookTitle className="text-sm leading-tight">{book.title}</BookTitle>
                <BookDescription className="text-[10px] line-clamp-2">{book.author}</BookDescription>
              </ModernBookCover>
            </div>
          </Link>
        </HoverCard.Trigger>

        {/* ── DESKTOP HOVER CARD OVERLAY ───────────────────────── */}
        <HoverCard.Portal>
          <HoverCard.Content
            side="right"
            align="start"
            sideOffset={10}
            avoidCollisions={true}
            collisionPadding={12}
            className="z-[60] hidden sm:block w-[340px] max-w-[70vw] bg-white rounded-[28px] p-6 shadow-[0_20px_50px_rgba(6,15,51,0.35)] border border-blue-100 outline-none animate-in fade-in-0 zoom-in-95 duration-200 font-quicksand"
            onPointerDownOutside={() => onOpenChange?.(false)}
          >
            <HoverCard.Arrow className="fill-white" width={18} height={10} />

            <h2 className="text-[22px] font-black text-slate-900 leading-[1.2] mb-1 tracking-tight">
              {book.title}
            </h2>

            <p className="text-[14px] font-bold text-slate-600 mb-2.5">
              {book.author}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Stars rating={ratingValue} size={15} />
              <span className="text-[13px] font-black text-slate-900 ml-0.5">
                {ratingValue.toFixed(2)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {ratingsCountLabel}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ml-auto ${
                isAvailable ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'
              }`}>
                {isAvailable ? 'Pronto para Retirada' : 'Exemplar Esgotado'}
              </span>
            </div>

            <div className="text-[12px] sm:text-[13px] leading-[1.5] text-slate-600 font-medium mb-5 line-clamp-3">
              {book.description}{' '}
              <Link href={href} className="text-blue-600 font-bold hover:underline inline-block ml-0.5">
                Ver Ficha &gt;
              </Link>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {onReserve && (
                <button
                  type="button"
                  onClick={() => onReserve(book)}
                  disabled={!isAvailable}
                  className={`font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                    isAvailable 
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-600/30' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <HugeIcon icon={Bookmark01Icon} size={15} />
                  <span>{isAvailable ? 'Reservar' : 'Indisponível'}</span>
                </button>
              )}

              <Link
                href={href}
                className="bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold text-[13px] px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-slate-200 hover:border-blue-200"
              >
                <HugeIcon icon={BookOpen01Icon} size={15} />
                <span>Ver Detalhes</span>
                <HugeIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>

      {/* ── CARD FOOTER (LABEL CLARA EM QUALQUER DISPOSITIVO) ─── */}
      <div className="mt-2.5 w-full max-w-[140px] sm:max-w-[160px] flex flex-col items-center text-center">
        <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 leading-tight mb-0.5" title={book.title}>
          {book.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-blue-200 truncate font-medium w-full">
          {book.author}
        </p>

        {/* Badges de Disponibilidade e Gênero (Abaixo do Livro, sem sobrepor a capa) */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${
            isAvailable 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {isAvailable ? `${book.availableCopies ?? book.quantity} disp.` : 'Indisp.'}
          </span>
          {book.genres && book.genres.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[9px] sm:text-[10px] font-medium text-blue-200 border border-blue-400/30 truncate max-w-[80px]">
              {book.genres[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCardWithHover;
