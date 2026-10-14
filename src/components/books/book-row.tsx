import { useRef } from 'react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import { BookCardHorizontal } from "./book-card-horizontal";

interface BookRowProps {
    title: string;
    books: any[]; // defining loose type for now to match dashboard data
}

export function BookRow({ title, books }: BookRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
      if (rowRef.current) {
          const { current } = rowRef;
          const scrollAmount = direction === 'left' ? -240 : 240;
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
  };

  if (!books || books.length === 0) return null;

  return (
    <section className="space-y-3 py-2 group/row">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg md:text-xl font-bold text-[#00008B] dark:text-[#4682B4] flex items-center gap-2">
            <span className="w-1 h-6 bg-[#00BFFF] rounded-full inline-block"></span>
            {title}
        </h2>
        
        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
            <button 
                onClick={() => scroll('left')}
                className="p-1.5 rounded-full bg-background/80 hover:bg-background border shadow-sm text-foreground/80 cursor-pointer"
            >
                <HugeIcon icon={ArrowLeft01Icon} size={16} />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="p-1.5 rounded-full bg-background/80 hover:bg-background border shadow-sm text-foreground/80 cursor-pointer"
            >
                <HugeIcon icon={ArrowRight01Icon} size={16} />
            </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="
          flex gap-4
          overflow-x-auto
          pb-6 pt-2 px-1
          scrollbar-hide
          snap-x snap-mandatory
          scroll-padding-x-4
        "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book, i) => (
          <div key={book.id || i} className="snap-start">
            <BookCardHorizontal book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
