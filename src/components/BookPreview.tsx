'use client';

import Image from 'next/image';
import { useState } from 'react';
import { OpenLibraryBook } from '@/types/book';

interface BookPreviewProps {
  book: OpenLibraryBook;
  onSelect: (book: Omit<OpenLibraryBook, 'coverUrl'> & { coverUrl?: string }) => void;
}

export function BookPreview({ book, onSelect }: BookPreviewProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleSelect = () => {
    setIsAdding(true);
    onSelect({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || undefined,
      description: book.description,
      publishedAt: book.publishedAt
    });
    setTimeout(() => setIsAdding(false), 1000); // Reset button state after 1 second
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {book.coverUrl && (
        <Image 
          src={book.coverUrl} 
          alt={book.title} 
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 320px"
          unoptimized
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      
      <h3 className="font-semibold text-lg">{book.title}</h3>
      <p className="text-gray-600">por {book.author}</p>
      
      {book.publishedAt && (
        <p className="text-sm text-gray-500">Publicado em: {book.publishedAt}</p>
      )}
      
      <button
        onClick={handleSelect}
        disabled={isAdding}
        className={`mt-3 w-full py-2 rounded ${
          isAdding 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isAdding ? 'Adicionado!' : 'Usar este livro'}
      </button>
    </div>
  );
}