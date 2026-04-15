// src/app/(public)/livros/[id]/page.tsx
import { ReserveForm } from '@/components/ReserveForm';
import { prisma } from '@/lib/prisma';
import { Icon } from '@iconify/react';

export const dynamic = 'force-dynamic';

async function getBook(bookId: string) {
  return prisma.book.findUnique({ where: { id: bookId } });
}

async function translateToPt(text: string): Promise<string> {
  if (!text) return text;
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch {
    return text;
  }
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Icon icon="solar:book-broken" className="size-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Livro não encontrado</h1>
          <a
            href="/livros"
            className="inline-flex items-center gap-2 text-[#1e40af] font-bold hover:underline"
          >
            <Icon icon="solar:arrow-left-linear" className="size-4" />
            Voltar ao catálogo
          </a>
        </div>
      </div>
    );
  }

  const translatedTitle = await translateToPt(book.title);
  const translatedDesc = book.description ? await translateToPt(book.description) : null;
  const isAvailable = book.quantity > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── HERO BACKGROUND ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#1e40af] pt-32 pb-44 sm:pt-40 sm:pb-48">
        {/* blurred cover backdrop */}
        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/80 to-blue-900/95" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-50 to-transparent z-10" />

        {/* Back link */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <a
            href="/livros"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition-colors mb-8"
          >
            <Icon icon="solar:arrow-left-linear" className="size-4" />
            Voltar ao catálogo
          </a>
        </div>
      </div>

      {/* ── MAIN CONTENT CARD (pulls up into hero) ──────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 -mt-36 relative z-20 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100">
            <div className="flex flex-col md:flex-row gap-0">

              {/* COVER */}
              <div className="md:w-56 lg:w-64 shrink-0 flex items-center justify-center p-6 md:p-8 bg-slate-50 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-slate-100">
                <div className="w-36 md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-slate-200">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl.replace('zoom=1', 'zoom=2').replace('&edge=curl', '')}
                      alt={translatedTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon icon="solar:book-2-bold-duotone" className="size-16 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">

                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {isAvailable ? `Disponível · ${book.quantity} cópias` : 'Indisponível'}
                  </span>
                </div>

                {/* Title & Author */}
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                    {translatedTitle}
                  </h1>
                  <p className="text-lg text-slate-500 font-semibold">por {book.author}</p>
                  {book.publishedAt && (
                    <p className="text-sm text-slate-400 font-medium">
                      Publicado em {new Date(book.publishedAt).getFullYear()}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100" />

                {/* Description */}
                {translatedDesc && (
                  <p className="text-slate-600 font-medium leading-relaxed text-base line-clamp-5">
                    {translatedDesc}
                  </p>
                )}

                {/* META CHIPS */}
                {book.genres && book.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                    {book.genres.map((g) => (
                      <span key={g} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* RESERVE FORM */}
                {isAvailable && (
                  <div className="mt-auto">
                    <div className="bg-[#1e40af]/5 border border-[#1e40af]/15 rounded-2xl p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-[#1e40af] flex items-center justify-center shrink-0">
                          <Icon icon="solar:bookmark-bold" className="size-4 text-white" />
                        </div>
                        <h2 className="text-lg font-black text-slate-800">Fazer Reserva</h2>
                      </div>
                      <ReserveForm bookId={book.id} />
                    </div>
                  </div>
                )}

                {!isAvailable && (
                  <div className="mt-auto rounded-2xl border border-red-100 bg-red-50 p-5 flex items-center gap-4">
                    <Icon icon="solar:clock-circle-bold-duotone" className="size-8 text-red-400 shrink-0" />
                    <div>
                      <p className="font-black text-red-700 text-sm">Livro indisponível no momento</p>
                      <p className="text-red-500 text-xs font-medium mt-0.5">
                        Todas as cópias estão emprestadas. Tente novamente em breve.
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
  );
}