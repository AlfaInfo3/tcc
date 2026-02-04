// src/app/(public)/livros/[id]/page.tsx
import { ReserveForm } from '@/components/ReserveForm';
import { prisma } from '@/lib/prisma';

async function getBook(bookId: string) {
  return prisma.book.findUnique({
    where: { id: bookId }
  });
}

export default async function BookDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const book = await getBook(id);

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
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {book.coverUrl && (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          )}
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">por {book.author}</p>
          
          {book.description && (
            <p className="mb-6 text-gray-700">{book.description}</p>
          )}
          
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full ${
              book.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {book.quantity > 0 ? `Disponível (${book.quantity})` : 'Indisponível'}
            </span>
          </div>
          
          {book.quantity > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg max-w-md">
              <h2 className="text-lg font-semibold mb-3">Fazer Reserva</h2>
              <ReserveForm 
                bookId={book.id} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}