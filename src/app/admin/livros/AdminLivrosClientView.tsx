'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  Search, 
  Pencil, 
  ExternalLink, 
  X,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { BookCard } from '@/components/books/book-card';
import { AdminLivrosHeader } from '@/components/admin/AdminLivrosHeader';

export interface AdminBookItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description?: string;
  genres: string[];
  publishedAt?: number;
  quantity: number;
  createdAt: string;
}

interface AdminLivrosClientViewProps {
  initialBooks: AdminBookItem[];
}

export function AdminLivrosClientView({ initialBooks }: AdminLivrosClientViewProps) {
  const [books] = useState<AdminBookItem[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // KPI Calculations
  const stats = useMemo(() => {
    const totalTitles = books.length;
    const totalCopies = books.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const availableTitles = books.filter((b) => b.quantity > 0).length;
    const outOfStockTitles = books.filter((b) => b.quantity <= 0).length;

    return {
      totalTitles,
      totalCopies,
      availableTitles,
      outOfStockTitles,
    };
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          (book.genres && book.genres.some((g) => g.toLowerCase().includes(q)));
        if (!matches) return false;
      }

      // 2. Status Filter
      if (statusFilter === 'available' && book.quantity <= 0) return false;
      if (statusFilter === 'unavailable' && book.quantity > 0) return false;

      return true;
    });
  }, [books, searchQuery, statusFilter]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ── TOP HEADER & ACTIONS ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Gerenciar Livros
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              {books.length} {books.length === 1 ? 'título' : 'títulos'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Catálogo completo e inventário físico do acervo da biblioteca escolar.
          </p>
        </div>

        <AdminLivrosHeader />
      </div>

      {/* ── INVENTORY STATS CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Titles */}
        <div className="bg-slate-50/70 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/70 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Títulos no Acervo
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalTitles}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
              Obras registradas
            </p>
          </div>
          <div className="size-11 rounded-xl bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen size={22} />
          </div>
        </div>

        {/* Card 2: Total Physical Copies */}
        <div className="bg-slate-50/70 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/70 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Exemplares Físicos
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalCopies}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
              Volumes em circulação
            </p>
          </div>
          <div className="size-11 rounded-xl bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers size={22} />
          </div>
        </div>

        {/* Card 3: Availability Health */}
        <div className="bg-slate-50/70 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/70 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Disponibilidade
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.availableTitles}
              <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400 ml-1">
                / {stats.totalTitles} títulos
              </span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
              {stats.outOfStockTitles === 0 ? '100% disponíveis para empréstimo' : `${stats.outOfStockTitles} título(s) esgotado(s)`}
            </p>
          </div>
          <div className="size-11 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ───────────────────────────────── */}
      <div className="bg-white dark:bg-neutral-800/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 p-3 sm:p-4 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, autor ou gênero..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900'
              }`}
            >
              Todos ({books.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900'
              }`}
            >
              Disponíveis ({stats.availableTitles})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unavailable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'unavailable'
                  ? 'bg-white dark:bg-neutral-800 text-rose-700 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900'
              }`}
            >
              Esgotados ({stats.outOfStockTitles})
            </button>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60 ml-auto md:ml-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Exibir em Grade de Livros 3D"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Exibir em Lista / Tabela"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────── */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center bg-slate-50/50 dark:bg-neutral-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800">
          <div className="mx-auto size-12 text-slate-400 mb-3 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800">
            <Search className="size-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Nenhum livro encontrado
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `Não encontramos resultados para "${searchQuery}". Tente outro termo.`
              : 'Não há livros cadastrados com o filtro selecionado.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ── GRID MODE: Compact Auto-Fill Grid (No more massive voids!) ── */
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,210px))] gap-5 sm:gap-6 justify-start items-start">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group/card relative bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-3.5 pt-4 pb-3.5 flex flex-col items-center shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 w-full"
            >
              {/* Disponibilidade Badge superior */}
              <div className="w-full flex items-center justify-between mb-2 px-1 text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold border ${
                    book.quantity > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                  }`}
                >
                  {book.quantity > 0 ? `${book.quantity} un.` : 'Esgotado'}
                </span>

                <Link
                  href={`/livros/${book.id}`}
                  target="_blank"
                  className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                  title="Ver no Catálogo de Alunos"
                >
                  <ExternalLink size={13} />
                </Link>
              </div>

              {/* 3D Book Card */}
              <div className="w-full flex justify-center">
                <BookCard
                  book={book}
                  adminMode={false} // We provide custom clean admin action buttons below
                />
              </div>

              {/* Botões de Ação Admin */}
              <div className="w-full mt-3 pt-2.5 border-t border-slate-100 dark:border-neutral-700/60 flex items-center gap-1.5">
                <Link
                  href={`/admin/livros/${book.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-2xs active:scale-95"
                >
                  <Pencil size={12} />
                  <span>Editar</span>
                </Link>
                <Link
                  href={`/livros/${book.id}`}
                  target="_blank"
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
                  title="Abrir no Catálogo"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── TABLE MODE: Clean Administrative Table View ───────── */
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-neutral-700/80 bg-slate-50/80 dark:bg-neutral-900/60 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Capa</th>
                  <th className="py-3 px-4">Título & Autor</th>
                  <th className="py-3 px-4">Gênero</th>
                  <th className="py-3 px-4 text-center">Exemplares</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-700/60 text-xs">
                {filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-neutral-750 transition-colors"
                  >
                    {/* Capa */}
                    <td className="py-2.5 px-4">
                      <div className="size-10 sm:w-10 sm:h-14 relative rounded-md overflow-hidden bg-slate-100 dark:bg-neutral-700 border border-slate-200/80 dark:border-neutral-600 shrink-0 shadow-2xs">
                        {book.coverUrl ? (
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BookOpen size={16} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Título & Autor */}
                    <td className="py-2.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {book.author || 'Autor não informado'}
                      </div>
                    </td>

                    {/* Gênero */}
                    <td className="py-2.5 px-4">
                      {book.genres && book.genres.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                          {book.genres[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Exemplares */}
                    <td className="py-2.5 px-4 text-center">
                      <span className="font-black text-slate-900 dark:text-white">
                        {book.quantity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          book.quantity > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {book.quantity > 0 ? 'Disponível' : 'Esgotado'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/livros/${book.id}`}
                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
                        >
                          <Pencil size={11} />
                          <span>Editar</span>
                        </Link>
                        <Link
                          href={`/livros/${book.id}`}
                          target="_blank"
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:bg-neutral-700 transition-colors"
                          title="Ver no Catálogo"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
