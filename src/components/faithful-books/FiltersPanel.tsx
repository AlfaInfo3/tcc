'use client';

import { ListFilter, X, CheckCircle2, BookOpen, Calendar, Check } from 'lucide-react';

export interface FilterState {
  published?: string;
  genre?: string;
  availableOnly?: boolean;
  rating?: string;
}

interface FiltersPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  genreCounts?: { name: string; count: number }[];
  totalBooksCount?: number;
  availableCount?: number;
  onClose?: () => void;
}

export function FiltersPanel({ 
  filters, 
  onFilterChange, 
  genreCounts = [], 
  totalBooksCount = 0,
  availableCount = 0,
  onClose 
}: FiltersPanelProps) {
  const publishedOptions = [
    'Últimos 2 anos',
    '2 a 5 anos atrás',
    '5 a 10 anos atrás',
    'Mais de 10 anos',
  ];

  const handleToggle = (key: keyof FilterState, value: string) => {
    if (filters[key] === value) {
      onFilterChange(key, undefined);
    } else {
      onFilterChange(key, value);
    }
  };

  const hasAnyFilter = Boolean(filters.genre || filters.published || filters.availableOnly);

  return (
    <aside className="w-full lg:w-[220px] shrink-0 bg-white/95 backdrop-blur-md rounded-[26px] p-5 shadow-xl border border-white/30 overflow-y-auto max-h-full scrollbar-thin select-none text-[12px] font-['Quicksand',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 text-slate-900 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ListFilter size={18} className="text-blue-600 stroke-[2.2]" />
          <h2 className="text-sm font-black tracking-tight">Filtros</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 1. Disponibilidade */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 text-[12px] mb-2">Disponibilidade</h3>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onFilterChange('availableOnly', false)}
            className={`py-1.5 px-2 rounded-lg transition-all text-center ${
              !filters.availableOnly
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({totalBooksCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('availableOnly', true)}
            className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              filters.availableOnly
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Disp. ({availableCount})
          </button>
        </div>
      </div>

      {/* 2. Categorias e Gêneros Reais do Banco */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-slate-800 text-[12px]">Gênero / Categoria</h3>
          {filters.genre && (
            <button
              type="button"
              onClick={() => onFilterChange('genre', undefined)}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Todos
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {genreCounts.map(({ name, count }) => {
            const isSelected = filters.genre?.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleToggle('genre', name)}
                className={`w-full flex items-center justify-between py-1 px-1.5 rounded-lg text-left transition-colors text-[11px] ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-black border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="truncate pr-1">{name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-blue-200 text-blue-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Ano de Publicação */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 text-[12px] mb-1.5">Ano de Publicação</h3>
        <div className="space-y-1">
          {publishedOptions.map((opt) => {
            const isSelected = filters.published === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleToggle('published', opt)}
                className={`block text-left w-full text-[11px] transition-colors leading-snug cursor-pointer py-0.5 ${
                  isSelected
                    ? 'text-blue-600 font-black pl-1.5 border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-blue-800 font-medium'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear all inside panel if needed */}
      {hasAnyFilter && (
        <button
          type="button"
          onClick={() => {
            onFilterChange('genre', undefined);
            onFilterChange('published', undefined);
            onFilterChange('availableOnly', false);
          }}
          className="w-full mt-2 py-1.5 text-center text-xs text-rose-600 hover:text-rose-800 font-bold border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
        >
          Limpar Filtros
        </button>
      )}
    </aside>
  );
}
