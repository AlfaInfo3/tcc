import Link from 'next/link';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Omit<Book, 'id'> & { id: string | number };
  onReserve?: (bookId: string | number) => void;
  adminMode?: boolean;
}

export function BookCard({ book, onReserve, adminMode }: BookCardProps) {
  const isAvailable = book.quantity > 0;
  const quantityDisplay = book.quantity;

  const detailHref = adminMode ? `/admin/livros/${book.id}` : `/livros/${book.id}`;
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group">
      {/* Title */}
      <h3 className="font-semibold text-lg relative z-0">{book.title}</h3>
      
      <p className="text-gray-600 relative z-0">por {book.author}</p>
      
      {/* Image */}
      <div className="relative mt-2 overflow-hidden rounded">
         {book.coverUrl && (
            <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
            />
         )}
      </div>
      
      {/* Genre & Desc */}
      <div className="mt-2 min-h-[60px] relative z-0">
          <div className="flex flex-wrap gap-1 mb-1">
            {book.genres && book.genres.map((g, i) => (
                <span key={i} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                    {g}
                </span>
            ))}
          </div>
          {book.description && (
            <p className="text-xs text-gray-500 line-clamp-3" title={book.description}>
                {book.description}
            </p>
          )}
      </div>

      <div className="mt-4 space-y-2 relative z-10">
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </span>

          <span className="text-sm text-gray-600">
            Qtd: {quantityDisplay}
          </span>
        </div>

        {onReserve && (
          <button
            onClick={(e) => {
               // Prevent card click
               e.stopPropagation();
               onReserve(book.id);
            }}
            disabled={!isAvailable}
            className={`w-full py-2 rounded text-sm relative z-20 ${
              isAvailable
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Reservar' : 'Indisponível'}
          </button>
        )}

        {adminMode && (
          <Link
            href={`/admin/livros/${book.id}`}
            className="block w-full text-center py-2 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 mt-2 relative z-20"
          >
            Editar
          </Link>
        )}
      </div>

      {/* Stretched Link covering the entire card (except buttons z-20) */}
      <Link 
        href={detailHref} 
        className="absolute inset-0 z-10" 
        aria-label={`Ver detalhes de ${book.title}`} 
      />
    </div>
  );
}