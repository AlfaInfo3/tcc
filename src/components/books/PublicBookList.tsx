'use client';

import { BookCard } from '@/components/books/book-card';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  ArrowUpDown,
  RotateCcw,
  BookMarked
} from 'lucide-react';

interface PublicBookListProps {
  books: Book[];
}

type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'author-asc';

export default function PublicBookList({ books }: PublicBookListProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [availabilityOnly, setAvailabilityOnly] = useState<'all' | 'available'>('all');
  const [selectedYearRange, setSelectedYearRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReserve = (bookId: string | number) => {
    router.push(`/livros/${bookId}`);
  };

  // Extract unique genres with their count
  const genreCounts = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach(book => {
      book.genres?.forEach(g => {
        const trimmed = g.trim();
        if (trimmed) {
          map.set(trimmed, (map.get(trimmed) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [books]);

  // Total counts
  const availableCount = useMemo(() => {
    return books.filter(b => b.quantity > 0).length;
  }, [books]);

  // Year filter presets
  const yearPresets = [
    { id: 'all', label: 'Todos os anos' },
    { id: '2020-now', label: '2020 ou mais recentes' },
    { id: '2010-2019', label: '2010 – 2019' },
    { id: '2000-2009', label: '2000 – 2009' },
    { id: 'before-2000', label: 'Antes de 2000 (Clássicos)' },
  ];

  // Filter & Sort logic
  const filteredBooks = useMemo(() => {
    const result = books.filter(book => {
      // 1. Text Search (title, author, genre)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        book.title.toLowerCase().includes(q) ||
        (book.author && book.author.toLowerCase().includes(q)) ||
        (book.genres && book.genres.some(g => g.toLowerCase().includes(q)));

      // 2. Genre filter
      const matchesGenre = !selectedGenre || (book.genres && book.genres.includes(selectedGenre));

      // 3. Availability filter
      const matchesAvailability = availabilityOnly === 'all' || book.quantity > 0;

      // 4. Year Range filter
      let matchesYear = true;
      if (selectedYearRange !== 'all') {
        const year = book.publishedAt;
        if (!year) {
          matchesYear = false;
        } else if (selectedYearRange === '2020-now') {
          matchesYear = year >= 2020;
        } else if (selectedYearRange === '2010-2019') {
          matchesYear = year >= 2010 && year <= 2019;
        } else if (selectedYearRange === '2000-2009') {
          matchesYear = year >= 2000 && year <= 2009;
        } else if (selectedYearRange === 'before-2000') {
          matchesYear = year < 2000;
        }
      }

      return matchesSearch && matchesGenre && matchesAvailability && matchesYear;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'author-asc') return (a.author || '').localeCompare(b.author || '');
      // 'recent' by default (createdAt descending)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [books, searchQuery, selectedGenre, availabilityOnly, selectedYearRange, sortBy]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedGenre ||
    availabilityOnly !== 'all' ||
    selectedYearRange !== 'all' ||
    sortBy !== 'recent'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre(null);
    setAvailabilityOnly('all');
    setSelectedYearRange('all');
    setSortBy('recent');
  };

  // Active filters count
  const activeFiltersCount = 
    (selectedGenre ? 1 : 0) + 
    (availabilityOnly !== 'all' ? 1 : 0) + 
    (selectedYearRange !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Render the filters content (shared between desktop sidebar and mobile drawer)
  const filtersContent = (
    <div className="space-y-6">
      {/* ── 1. BUSCA ────────────────────────────────────────── */}
      <div>
        <label htmlFor="search-books" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Buscar no Acervo
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            id="search-books"
            ref={searchInputRef}
            type="text"
            placeholder="Título, autor ou gênero..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                title="Limpar busca"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 rounded border border-slate-300/50">
                ⌘K
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200/80" />

      {/* ── 2. DISPONIBILIDADE ─────────────────────────────── */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Status de Disponibilidade
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs font-medium">
          <button
            type="button"
            onClick={() => setAvailabilityOnly('all')}
            className={`py-2 px-3 rounded-lg transition-all text-center ${
              availabilityOnly === 'all'
                ? 'bg-white text-blue-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({books.length})
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityOnly('available')}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              availabilityOnly === 'available'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            Disponíveis ({availableCount})
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-200/80" />

      {/* ── 3. GÊNEROS E TEMAS ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Categorias & Temas
          </label>
          {selectedGenre && (
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ver todos
            </button>
          )}
        </div>

        <div className="max-h-56 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
              selectedGenre === null
                ? 'bg-blue-50 text-blue-800 font-bold'
                : 'text-slate-700 hover:bg-slate-100/70 font-medium'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="size-3.5 opacity-70" />
              Todas as categorias
            </span>
            <span className="text-[11px] opacity-75">
              {books.length}
            </span>
          </button>

          {genreCounts.map(({ name, count }) => {
            const isSelected = selectedGenre === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedGenre(isSelected ? null : name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <span className="truncate pr-2">{name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                    isSelected
                      ? 'bg-blue-200 text-blue-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200/80" />

      {/* ── 4. ANO DE PUBLICAÇÃO ───────────────────────────── */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Ano de Publicação
        </label>
        <div className="space-y-1">
          {yearPresets.map(preset => {
            const isSelected = selectedYearRange === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedYearRange(preset.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="size-3.5 opacity-70" />
                  {preset.label}
                </span>
                {isSelected && <CheckCircle2 className="size-3.5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200/80" />

      {/* ── 5. ORDENAÇÃO ───────────────────────────────────── */}
      <div>
        <label htmlFor="sort-books" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Ordenar Por
        </label>
        <div className="relative">
          <select
            id="sort-books"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="recent">Mais recentes cadastrados</option>
            <option value="title-asc">Título (A – Z)</option>
            <option value="title-desc">Título (Z – A)</option>
            <option value="author-asc">Autor (A – Z)</option>
          </select>
          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* BOTÃO LIMPAR FILTROS */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
        >
          <RotateCcw className="size-3.5" />
          Limpar Todos os Filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* ── CONTROLE MOBILE: BARRA SUPERIOR PARA ABRIR FILTROS ─ */}
      <div className="lg:hidden mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filtros do Acervo</span>
          {activeFiltersCount > 0 && (
            <span className="size-4.5 rounded-full bg-[#FFD166] text-slate-900 text-[10px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── MODAL / GAVETA MOBILE DE FILTROS ──────────────── */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-sm">Filtros do Catálogo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {filtersContent}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-xs"
              >
                Ver {filteredBooks.length} obras
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT PRINCIPAL: SIDEBAR FIXA + GRID DE LIVROS ──── */}
      <div className="flex flex-col lg:flex-row items-start gap-8">

        {/* ── SIDEBAR FIXA NO DESKTOP ────────────────────────── */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-28 self-start">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <SlidersHorizontal className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-none">Filtros do Acervo</h2>
                  <span className="text-[11px] text-slate-500 font-medium">Refine sua pesquisa</span>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  title="Limpar todos os filtros"
                >
                  <RotateCcw className="size-3" />
                  Limpar
                </button>
              )}
            </div>

            {/* Conteúdo compartilhado dos filtros */}
            {filtersContent}
          </div>
        </aside>

        {/* ── CONTEÚDO PRINCIPAL (HEADER DE RESULTADOS + LIVROS) ─ */}
        <div className="flex-1 min-w-0 w-full space-y-6">

          {/* BARRA DE STATUS / RESULTADOS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookMarked className="size-4 text-blue-800" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Mostrando <span className="text-blue-900 font-black">{filteredBooks.length}</span> de <span className="text-slate-500">{books.length}</span> títulos no catálogo
              </span>
            </div>

            {/* CHIPS DE FILTROS ATIVOS */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedGenre && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    Gênero: {selectedGenre}
                    <button onClick={() => setSelectedGenre(null)} className="hover:text-blue-950">
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {availabilityOnly === 'available' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Apenas disponíveis
                    <button onClick={() => setAvailabilityOnly('all')} className="hover:text-emerald-950">
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {selectedYearRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Ano: {yearPresets.find(p => p.id === selectedYearRange)?.label}
                    <button onClick={() => setSelectedYearRange('all')} className="hover:text-amber-950">
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    Busca: &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery('')} className="hover:text-slate-900">
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-red-600 hover:underline ml-1"
                >
                  Limpar todos
                </button>
              </div>
            )}
          </div>

          {/* ── GRID DOS LIVROS (PRESERVANDO OS CARDS 3D MODERNOS) ─ */}
          {filteredBooks.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8">
              <div className="size-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                <Search className="size-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Nenhum livro encontrado</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Não localizamos nenhuma obra com os filtros selecionados. Tente ajustar os termos de pesquisa ou remover restrições.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <RotateCcw className="size-3.5" />
                Limpar filtros e ver catálogo completo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onReserve={handleReserve}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
