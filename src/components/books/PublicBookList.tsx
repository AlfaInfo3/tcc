'use client';

import { BookCard } from '@/components/books/book-card';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';

interface PublicBookListProps {
  books: Book[];
}

export default function PublicBookList({ books }: PublicBookListProps) {
  const router = useRouter();

  const handleReserve = (bookId: string | number) => {
    router.push(`/reservar?bookId=${bookId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onReserve={handleReserve}
        />
      ))}
    </div>
  );
}
