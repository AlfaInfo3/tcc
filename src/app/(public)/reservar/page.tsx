// src/app/(public)/reservar/page.tsx
import { ReserveForm } from '@/components/ReserveForm';
import { prisma } from '@/lib/prisma';

async function getBook(bookId: string) {
  return prisma.book.findUnique({
    where: { id: bookId }
  });
}

export default async function ReservePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ bookId?: string }> 
}) {
  const params = await searchParams;
  
  if (!params.bookId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Erro</h1>
        <p>Nenhum livro selecionado para reserva.</p>
      </div>
    );
  }

  const book = await getBook(params.bookId);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Erro</h1>
        <p>Livro não encontrado.</p>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Reservar Livro</h1>
      
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p className="text-gray-600">por {book.author}</p>
      </div>
      
      <div className="max-w-md">
        <ReserveForm 
          bookId={book.id} 
        />
      </div>
    </div>
  );
}