'use client';

import { useState, useMemo, useRef, useDeferredValue } from 'react';
import { NavRail } from '@/components/faithful-books/NavRail';
import { FiltersPanel, FilterState } from '@/components/faithful-books/FiltersPanel';
import { TopBar } from '@/components/faithful-books/TopBar';
import { BookCardWithHover, BookItem } from '@/components/faithful-books/BookCardWithHover';
import { AlphaRail } from '@/components/faithful-books/AlphaRail';
import { ReserveModal } from '@/components/faithful-books/ReserveModal';
import Link from 'next/link';
import { Home01Icon, LibraryIcon, FilterHorizontalIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';

interface LivrosClientViewProps {
  initialBooks: BookItem[];
}

export function LivrosClientView({ initialBooks }: LivrosClientViewProps) {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [sortBy, setSortBy] = useState('az');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reserve Modal State
  const [reserveBook, setReserveBook] = useState<BookItem | null>(null);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  // Apenas um preview de livro pode ficar aberto por vez.
  const [openHoverId, setOpenHoverId] = useState<string | null>(null);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique genres with real counts from database books
  const genreCounts = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => {
      if (b.genres && Array.isArray(b.genres)) {
        b.genres.forEach((g) => {
          const trimmed = g.trim();
          if (trimmed) {
            map.set(trimmed, (map.get(trimmed) || 0) + 1);
          }
        });
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [books]);

  // Available count
  const availableCount = useMemo(() => {
    return books.filter((b) => (b.availableCopies ?? b.quantity) > 0).length;
  }, [books]);

  // Handle Tab Switch
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'search') {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
      if (searchInput) searchInput.focus();
    } else if (tab === 'books') {
      setSelectedLetter(null);
    }
  };

  // Filter & Sort logic
  const filteredBooks = useMemo(() => {
    const list = books.filter((book) => {
      // 1. Search filter (case & accent insensitive)
      if (deferredSearch.trim()) {
        const q = deferredSearch.toLowerCase().trim();
        const matches =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          (book.description && book.description.toLowerCase().includes(q)) ||
          (book.genres && book.genres.some((g) => g.toLowerCase().includes(q)));
        if (!matches) return false;
      }

      // 2. Tab filter
      if (activeTab === 'last') {
        if ((book.rating || 4.8) < 4.8) return false;
      }

      // 3. Initial letter filter (AlphaRail)
      if (selectedLetter) {
        const initial = (book.title || 'A').trim()[0]?.toUpperCase();
        if (initial !== selectedLetter) return false;
      }

      // 4. Availability filter
      if (filters.availableOnly) {
        const avail = book.availableCopies ?? book.quantity;
        if (avail <= 0) return false;
      }

      // 5. Genre Filter
      if (filters.genre) {
        const target = filters.genre.toLowerCase();
        const hasGenre = book.genres?.some((g) => g.toLowerCase() === target);
        if (!hasGenre) return false;
      }

      // 6. Publication Year Filter
      if (filters.published) {
        const currentYear = new Date().getFullYear();
        const year = book.publishedAt || currentYear;
        if (filters.published === 'Últimos 2 anos' && year < currentYear - 2) return false;
        if (filters.published === '2 a 5 anos atrás' && (year < currentYear - 5 || year > currentYear - 2)) return false;
        if (filters.published === '5 a 10 anos atrás' && (year < currentYear - 10 || year > currentYear - 5)) return false;
        if (filters.published === 'Mais de 10 anos' && year >= currentYear - 10) return false;
      }

      return true;
    });

    // Sort logic
    list.sort((a, b) => {
      if (activeTab === 'recent') {
        return (b.publishedAt || 0) - (a.publishedAt || 0);
      }
      if (activeTab === 'last') {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return (b.publishedAt || 0) - (a.publishedAt || 0);
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [books, deferredSearch, filters, sortBy, activeTab, selectedLetter]);

  // Unique available letters from books
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      const char = (b.title || '').trim()[0]?.toUpperCase();
      if (char) set.add(char);
    });
    return set;
  }, [books]);

  // Letter Click Toggle
  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      gridContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRemoveFilter = (key: keyof FilterState) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleResetAll = () => {
    setFilters({});
    setSearchQuery('');
    setSortBy('az');
    setSelectedLetter(null);
    setActiveTab('books');
  };

  // Open reservation modal
  const handleOpenReserve = (book: BookItem) => {
    setReserveBook(book);
    setIsReserveOpen(true);
  };

  // Refresh book counts after a reservation
  const handleReservationSuccess = () => {
    if (!reserveBook) return;
    setBooks((prev) =>
      prev.map((b) =>
        b.id === reserveBook.id
          ? {
              ...b,
              availableCopies: Math.max(0, (b.availableCopies ?? b.quantity) - 1),
            }
          : b
      )
    );
  };

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-[#060F33] via-[#0B1B5C] to-[#040924] p-3 sm:p-4 md:p-6 font-quicksand text-slate-800 antialiased relative lg:h-dvh lg:overflow-hidden">
      
      {/* ── MOBILE HEADER BAR (< md) ───────────────────── */}
      <div className="flex md:hidden items-center justify-between gap-3 mb-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md">
            LM
          </div>
          <div>
            <h1 className="text-xs font-black leading-tight text-white">Biblioteca</h1>
            <p className="text-[10px] text-blue-200">Laurentino Martins</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-all"
          >
            <HugeIcon icon={FilterHorizontalIcon} size={14} />
            <span>Filtros</span>
            {Object.values(filters).filter(Boolean).length > 0 && (
              <span className="size-4 bg-white text-blue-700 text-[10px] font-black rounded-full flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          <Link
            href="/"
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="Início"
          >
            <HugeIcon icon={Home01Icon} size={16} />
          </Link>
        </div>
      </div>

      {/* ── MAIN APP FRAME (DESKTOP / MOBILE RESPONSIVE) ───────── */}
      <div className="flex items-start gap-4 lg:gap-5 h-auto lg:h-full max-w-[1720px] mx-auto">
        
        {/* 1. Left Nav Rail (~76px, hidden on small screens) */}
        <div className="hidden md:flex shrink-0">
          <NavRail activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* 2. Desktop Filters Panel (~220px, real database genres) */}
        <div className="hidden lg:block shrink-0 h-full">
          <FiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            genreCounts={genreCounts}
            totalBooksCount={books.length}
            availableCount={availableCount}
          />
        </div>

        {/* 3. Center Area: Top Bar + Book Grid */}
        <main className="flex-1 flex flex-col h-full min-w-0 pr-0 lg:pr-1 w-full">
          
          {/* Active Tab Notice Banner (Destaques or Recentes) */}
          {activeTab === 'last' && (
            <div className="mb-2.5 bg-blue-500/20 border border-blue-400/30 rounded-2xl px-4 py-2 text-white flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <HugeIcon icon={SparklesIcon} size={15} className="text-amber-300" />
                <span className="font-bold">Modo Destaques:</span>
                <span className="text-blue-100">Exibindo livros mais bem avaliados do acervo escolar</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('books')}
                className="text-[11px] font-bold text-blue-200 hover:text-white underline cursor-pointer"
              >
                Ver todos
              </button>
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="mb-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-4 py-2 text-white flex items-center justify-between text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <HugeIcon icon={SparklesIcon} size={15} className="text-emerald-300" />
                <span className="font-bold">Modo Recentes:</span>
                <span className="text-emerald-100">Exibindo títulos mais recentes catalogados</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('books')}
                className="text-[11px] font-bold text-emerald-200 hover:text-white underline cursor-pointer"
              >
                Ver todos
              </button>
            </div>
          )}

          {/* Top Bar with Sort, Active Chips, Counters, Search and Mobile Filter Toggle */}
          <TopBar
            totalCount={books.length}
            filteredCount={filteredBooks.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onResetAll={handleResetAll}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            selectedLetter={selectedLetter}
            onRemoveLetter={() => setSelectedLetter(null)}
          />

          {/* Book Grid Area */}
          <div 
            ref={gridContainerRef}
            onScroll={() => setOpenHoverId(null)}
            className="flex-1 overflow-y-auto pr-1 sm:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[500px]"
          >
            {filteredBooks.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-center bg-white/10 backdrop-blur-md rounded-[28px] p-8 text-white border border-white/20">
                <h3 className="text-xl font-bold mb-1">Nenhum livro encontrado</h3>
                <p className="text-xs text-blue-200 mb-4 max-w-sm">
                  Não encontramos títulos correspondentes com os filtros ou termo pesquisado no acervo escolar.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-lg transition-all cursor-pointer"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 pt-4 sm:pt-6 pb-20 lg:pb-8">
                {filteredBooks.map((book) => (
                  <BookCardWithHover
                    key={book.id}
                    book={book}
                    open={openHoverId === book.id}
                    onOpenChange={(isOpen) => setOpenHoverId(isOpen ? book.id : null)}
                    onReserve={handleOpenReserve}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* 4. Right A-Z Rail (hidden on mobile/tablet) */}
        <div className="hidden lg:flex shrink-0">
          <AlphaRail
            availableLetters={availableLetters}
            activeLetter={selectedLetter || undefined}
            onLetterClick={handleLetterClick}
          />
        </div>
      </div>

      {/* ── MOBILE FILTERS DRAWER / SLIDE-OVER (< lg) ───────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#060F33] p-4 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="flex-1 overflow-y-auto">
              <FiltersPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                genreCounts={genreCounts}
                totalBooksCount={books.length}
                availableCount={availableCount}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md text-center hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Aplicar Filtros ({filteredBooks.length} encontrados)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAVIGATION BAR (< md) ────────────────── */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 p-2 flex items-center justify-around select-none">
        <Link
          href="/"
          className="flex flex-col items-center text-slate-500 hover:text-blue-600 py-1 px-3 transition-colors"
        >
          <HugeIcon icon={Home01Icon} size={18} />
          <span className="text-[10px] font-bold mt-0.5">Início</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            handleResetAll();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-blue-600 py-1 px-3"
        >
          <HugeIcon icon={LibraryIcon} size={18} />
          <span className="text-[10px] font-black mt-0.5">Acervo</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex flex-col items-center text-slate-500 hover:text-blue-600 py-1 px-3 transition-colors relative"
        >
          <HugeIcon icon={FilterHorizontalIcon} size={18} />
          <span className="text-[10px] font-bold mt-0.5">Filtros</span>
          {Object.values(filters).filter(Boolean).length > 0 && (
            <span className="absolute top-0 right-2 size-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </nav>

      {/* ── MODAL DE RESERVA RÁPIDA ─────────────────────────────── */}
      <ReserveModal
        book={reserveBook}
        isOpen={isReserveOpen}
        onClose={() => {
          setIsReserveOpen(false);
          setReserveBook(null);
        }}
        onSuccess={handleReservationSuccess}
      />
    </div>
  );
}

export default LivrosClientView;
