import Image from 'next/image';
import { BookOpen, ChevronRight } from 'lucide-react';

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
}

interface BookRecommendationCardProps {
  book: BookRecommendation;
  index?: number;
}

export function BookRecommendationCard({ book, index = 0 }: BookRecommendationCardProps) {
  return (
    <div
      className="card-duo p-3 flex items-center gap-3 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[80px]"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
    >
      {/* Cover */}
      <div className="w-14 h-20 rounded-xl bg-gradient-to-br from-secondary/20 to-purple/20 border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
        {book.coverUrl ? (
          <Image src={book.coverUrl} alt={`Capa de ${book.title}`} width={56} height={80} sizes="56px" unoptimized className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="text-secondary" size={24} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-tight">{book.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{book.author}</p>
        {book.genre && (
          <span className="inline-block mt-1.5 text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-lg">
            {book.genre}
          </span>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="text-muted-foreground flex-shrink-0" size={18} />
    </div>
  );
}

export function BookRecommendationList({
  books,
  title = 'Próxima Leitura',
}: {
  books: BookRecommendation[];
  title?: string;
}) {
  if (!books || books.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-secondary/20 flex items-center justify-center">
          <BookOpen className="text-secondary" size={14} />
        </div>
        <h2 className="font-black text-lg text-foreground">{title}</h2>
      </div>

      <div className="space-y-2">
        {books.slice(0, 5).map((book, i) => (
          <BookRecommendationCard key={book.id || i} book={book} index={i} />
        ))}
      </div>
    </div>
  );
}
