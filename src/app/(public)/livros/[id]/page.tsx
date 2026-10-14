// src/app/(public)/livros/[id]/page.tsx
import { ReserveForm } from '@/components/ReserveForm';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookCard } from '@/components/books/book-card';
import { BookReviewsSection } from '@/components/books/BookReviewsSection';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Library, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark,
  Share2,
  BookMarked,
  Sparkles,
  Home,
  Star
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      loans: {
        where: { status: 'active' }
      },
      reservations: {
        where: { status: 'reserved' }
      },
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return book;
}

async function getRelatedBooks(currentBookId: string, genres: string[]) {
  // 1. Busca primeiro por obras do mesmo gênero
  let related: any[] = [];
  if (genres && genres.length > 0) {
    related = await prisma.book.findMany({
      where: {
        id: { not: currentBookId },
        genres: { hasSome: genres },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  }

  // 2. Se encontrar menos de 4, complementa com outros livros do acervo escolar
  if (related.length < 4) {
    const existingIds = [currentBookId, ...related.map((b) => b.id)];
    const additional = await prisma.book.findMany({
      where: {
        id: { notIn: existingIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 4 - related.length,
    });
    related = [...related, ...additional];
  }

  return related;
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060F33] via-[#0B1B5C] to-[#040924] px-4 py-20 font-['Quicksand',sans-serif]">
        <div className="text-center max-w-md bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl space-y-5 text-slate-800">
          <div className="size-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Livro não encontrado</h1>
            <p className="text-sm text-slate-600">
              O título solicitado não foi localizado em nosso acervo ou pode ter sido desativado temporariamente.
            </p>
          </div>
          <Link
            href="/livros"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="size-4" />
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Calculate copies available (subtract active loans and active reservations)
  const activeLoansCount = book.loans ? book.loans.length : 0;
  const activeResCount = (book as any).reservations ? (book as any).reservations.length : 0;
  const availableCopies = Math.max(0, book.quantity - activeLoansCount - activeResCount);
  const isAvailable = availableCopies > 0;

  // Calculate review stats
  const reviews = (book as any).reviews || [];
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  const serializedReviews = reviews.map((r: any) => ({
    id: r.id,
    bookId: r.bookId,
    studentName: r.studentName,
    studentClass: r.studentClass,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));

  // Related books
  const relatedBooks = await getRelatedBooks(book.id, book.genres);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060F33] via-[#0B1B5C] to-[#040924] font-['Quicksand',sans-serif] text-slate-800 pt-8 sm:pt-12 pb-24 antialiased">
      
      {/* ── BREADCRUMB & VOLTAR ─────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-blue-200">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Início</span>
            </Link>
            <span className="text-blue-400">/</span>
            <Link href="/livros" className="hover:text-white transition-colors">
              Acervo de Livros
            </Link>
            <span className="text-blue-400">/</span>
            <span className="text-white font-black truncate max-w-[200px] sm:max-w-xs">
              {book.title}
            </span>
          </nav>

          <Link
            href="/livros"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-md backdrop-blur-md"
          >
            <ArrowLeft className="size-3.5" />
            <span>Voltar ao Acervo</span>
          </Link>
        </div>
      </div>

      {/* ── CARD PRINCIPAL DA OBRA ─────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] border border-white/40 shadow-2xl overflow-hidden">
          
          {/* Header Superior da Ficha */}
          <div className="px-6 sm:px-10 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex items-center gap-2.5 text-xs font-black text-blue-900">
              <div className="size-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Library size={15} />
              </div>
              <span>Acervo Escolar · Colégio Estadual Laurentino Martins</span>
            </div>

            {/* Status & Avaliações Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="#avaliacoes"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                title="Ver avaliações deste livro"
              >
                <Star className="size-3.5 text-amber-500 fill-amber-500" />
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-amber-700/80 font-semibold text-[11px]">
                  ({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </a>

              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black border border-emerald-200 shadow-2xs">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Disponível para Reserva · {availableCopies} {availableCopies === 1 ? 'exemplar pronto' : 'exemplares prontos'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-800 bg-rose-50 px-3 py-1 rounded-full text-xs font-black border border-rose-200 shadow-2xs">
                  <AlertCircle className="size-3.5 text-rose-500" />
                  Todos os exemplares emprestados
                </span>
              )}
            </div>
          </div>

          {/* Grid Principal: Capa + Detalhes */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* ── COLUNA DA ESQUERDA: CAPA COM EFEITO LIVRO ── */}
              <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
                <div className="relative group w-48 sm:w-56 md:w-full max-w-[270px] aspect-[2/3]">
                  {/* Sombra de Elevação */}
                  <div className="absolute inset-0 rounded-r-2xl rounded-l-sm bg-slate-950/20 shadow-[0_25px_50px_-12px_rgba(6,15,51,0.35)]" />
                  
                  {/* Livro com Lombada Tridimensional */}
                  <div className="relative w-full h-full rounded-r-2xl rounded-l-xs overflow-hidden border border-slate-200/80 bg-slate-900 flex flex-col shadow-xl">
                    {/* Brilho da Lombada */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 via-white/20 to-transparent z-10 pointer-events-none" />
                    
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={`Capa do livro ${book.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
                        <BookOpen className="size-8 text-blue-300 opacity-80" />
                        <div>
                          <p className="font-black text-lg leading-tight mb-2 line-clamp-3">{book.title}</p>
                          <p className="text-xs text-blue-200 font-medium">{book.author || 'Autor não informado'}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">Laurentino</span>
                      </div>
                    )}
                  </div>

                  {/* Borda das páginas laterais */}
                  <div className="absolute -right-2 top-2.5 bottom-2.5 w-2 bg-gradient-to-r from-slate-200 to-slate-100 rounded-r-sm -z-10 shadow-xs" />
                </div>

                {/* Código de Catalogação Escolar */}
                <div className="mt-5 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tombo / Código no Acervo
                  </span>
                  <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-3.5 py-1 rounded-lg inline-block border border-slate-200">
                    LIB-{book.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ── COLUNA DA DIREITA: INFORMAÇÕES EDITORIAIS ─── */}
              <div className="md:col-span-7 lg:col-span-8 space-y-6">
                
                {/* Título & Autor & Avaliação Rápida */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {book.title}
                  </h1>
                  {book.author && (
                    <p className="text-base sm:text-lg text-slate-600 font-bold flex items-center gap-2">
                      <span className="text-slate-400 font-normal">Autor(a):</span>
                      <span className="text-blue-700 font-black">{book.author}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-4 ${
                            s <= Math.round(averageRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-slate-300 font-bold">·</span>
                    <a
                      href="#avaliacoes"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {totalReviews === 0
                        ? 'Seja o primeiro a avaliar'
                        : `${totalReviews} ${totalReviews === 1 ? 'avaliação registrada' : 'avaliações registradas'}`}
                    </a>
                  </div>
                </div>

                {/* Gêneros & Categorias */}
                {book.genres && book.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {book.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Ficha Técnica Catalogada */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl border border-slate-200/80 p-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="size-3 text-slate-500" />
                      Ano
                    </span>
                    <p className="text-sm font-black text-slate-800">
                      {book.publishedAt ? book.publishedAt : 'Não catalogado'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="size-3 text-slate-500" />
                      Total Físico
                    </span>
                    <p className="text-sm font-black text-slate-800">
                      {book.quantity} {book.quantity === 1 ? 'exemplar' : 'exemplares'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Disponíveis
                    </span>
                    <p className={`text-sm font-black ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {availableCopies} {availableCopies === 1 ? 'pronto' : 'prontos'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Bookmark className="size-3 text-blue-600" />
                      Modalidade
                    </span>
                    <p className="text-sm font-black text-slate-800">
                      Empréstimo Escolar
                    </p>
                  </div>
                </div>

                {/* Sinopse / Resumo */}
                <div className="space-y-2.5 pt-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BookMarked className="size-4 text-blue-700" />
                    Sinopse & Apresentação da Obra
                  </h2>
                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                    {book.description ? (
                      <p className="whitespace-pre-line">{book.description}</p>
                    ) : (
                      <p className="text-slate-400 italic">
                        Esta obra não possui sinopse cadastrada no acervo no momento. Consulte o bibliotecário para mais informações sobre o conteúdo.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── PAINEL DE RESERVA DO ALUNO ───────────────── */}
                <div className="pt-2">
                  {isAvailable ? (
                    <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                          <Bookmark className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            Reserva Online de Exemplar
                          </h3>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5">
                            Preencha seus dados abaixo para reservar este livro. O exemplar ficará guardado na biblioteca escolar para você retirar.
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <ReserveForm bookId={book.id} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                      <div className="size-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertCircle className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-rose-900">
                          Exemplares Temporariamente Esgotados
                        </h3>
                        <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                          Todos os {book.quantity} exemplares deste título estão emprestados no momento. Assim que um aluno realizar a devolução, o livro ficará disponível para novas reservas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEÇÃO DE AVALIAÇÕES E RESENHAS DOS ALUNOS ───────── */}
      <BookReviewsSection
        bookId={book.id}
        bookTitle={book.title}
        initialReviews={serializedReviews}
      />

      {/* ── SEÇÃO: SUGESTÕES DE LIVROS & OUTRAS OBRAS DO ACERVO ───────── */}
      {relatedBooks && relatedBooks.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-black uppercase tracking-wider mb-1.5">
                <BookOpen className="size-3.5 text-blue-300" />
                Sugestões da Biblioteca
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Outras Obras do Acervo
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/80 font-medium mt-0.5">
                Explore mais títulos disponíveis para empréstimo e reserva no Laurentino Martins
              </p>
            </div>

            <Link
              href="/livros"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-sm"
            >
              <span>Ver todo o catálogo</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-stretch pt-2">
            {relatedBooks.map((relBook) => (
              <BookCard
                key={relBook.id}
                dark={true}
                book={{
                  id: relBook.id,
                  title: relBook.title,
                  author: relBook.author || 'Autor não informado',
                  coverUrl: relBook.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
                  description: relBook.description || '',
                  publishedAt: relBook.publishedAt || 2024,
                  quantity: relBook.quantity,
                  genres: relBook.genres || [],
                  createdAt: relBook.createdAt.toISOString()
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}