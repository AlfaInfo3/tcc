import PublicBookList from '@/components/books/PublicBookList';
import { prisma } from '@/lib/prisma';
import { BookOpen } from 'lucide-react';

// Force dynamic rendering to prevent prerendering without a DB
export const dynamic = 'force-dynamic';

async function getBooks() {
  return prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export default async function LivrosPage() {
  const books = await getBooks();

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 pb-16">
       {/* Hero Banner Section (Consistent with Home Page) */}
       <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[#1e40af]"></div>
             {/* Gradient overlay */}
             <div className="absolute inset-0 bg-linear-to-b from-blue-950/80 to-blue-900/90 mix-blend-multiply"></div>
             {/* Decorative blobs */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD166]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
          </div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center justify-center text-center mt-8">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md mb-6 border border-white/20 shadow-lg">
              <BookOpen className="h-10 w-10 text-[#FFD166]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-md">
              Catálogo de Livros
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-medium drop-shadow">
               Explore nossa coleção completa de obras disponíveis na biblioteca do Colégio Estadual Laurentino Martins.
            </p>
          </div>
       </section>

      <div className="container mx-auto px-6 lg:px-12 py-12 max-w-7xl relative z-20">

      <PublicBookList books={books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author || 'Desconhecido',
        coverUrl: b.coverUrl || '',
        description: b.description || '',
        publishedAt: b.publishedAt || undefined,
        quantity: b.quantity,
        genres: b.genres,
        createdAt: b.createdAt.toISOString()
      }))} />
    </div>
    </div>
  );
}
