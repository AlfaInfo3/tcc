'use client';

import { 
  Search01Icon, 
  ReloadIcon, 
  CancelCircleIcon, 
  ArrowDown01Icon, 
  FilterHorizontalIcon 
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FilterState } from './FiltersPanel';

interface TopBarProps {
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
  onResetAll: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenMobileFilters?: () => void;
  selectedLetter?: string | null;
  onRemoveLetter?: () => void;
}

export function TopBar({
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  filters,
  onRemoveFilter,
  onResetAll,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  selectedLetter,
  onRemoveLetter,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Active filters list to display chips
  const activeChips: { key: keyof FilterState; label: string }[] = [];
  if (filters.published) activeChips.push({ key: 'published', label: `Publicação: ${filters.published}` });
  if (filters.genre) activeChips.push({ key: 'genre', label: `Gênero: ${filters.genre}` });
  if (filters.availableOnly) activeChips.push({ key: 'availableOnly', label: 'Apenas Disponíveis' });
  if (filters.rating) activeChips.push({ key: 'rating', label: `Avaliação: ${filters.rating}` });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (selectedLetter ? 1 : 0);

  const sortLabels: Record<string, string> = {
    'az': 'Ordem: A - Z',
    'za': 'Ordem: Z - A',
    'rating': 'Melhores Avaliações',
    'year': 'Ano de Publicação',
    'recent': 'Adicionados Recentes',
  };

  return (
    <div className="flex flex-col gap-3 text-xs font-quicksand mb-4 select-none">
      {/* Upper row: Search & Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Side: Mobile Filter button + Sort Dropdown */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          {onOpenMobileFilters && (
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <HugeIcon icon={FilterHorizontalIcon} size={14} />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="size-4.5 bg-white text-blue-700 text-[10px] font-black rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          {/* Sort Dropdown */}
          <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="bg-white/95 hover:bg-white px-4 py-2 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-white/20 flex items-center gap-1.5 cursor-pointer transition-colors outline-none"
              >
                <span>{sortLabels[sortBy] || 'Ordem: A - Z'}</span>
                <HugeIcon icon={ArrowDown01Icon} size={14} className="text-slate-500" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                className="z-50 min-w-[170px] bg-white rounded-2xl p-1.5 shadow-xl border border-slate-100 text-xs font-bold animate-in fade-in zoom-in-95 duration-150"
              >
                <DropdownMenu.Item
                  onClick={() => onSortChange('az')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none"
                >
                  Ordem: A - Z
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onSortChange('za')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none"
                >
                  Ordem: Z - A
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onSortChange('rating')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none"
                >
                  Melhores Avaliações
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onSortChange('year')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none"
                >
                  Ano de Publicação
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onSortChange('recent')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none"
                >
                  Adicionados Recentes
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Book Counter */}
          <span className="hidden sm:inline-block text-xs font-bold text-blue-100/90 ml-1">
            Exibindo {filteredCount} de {totalCount} livros
          </span>
        </div>

        {/* Right Search Input */}
        <div className="relative flex-1 sm:flex-initial sm:w-72">
          <HugeIcon icon={Search01Icon} size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, autor ou gênero..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white/95 focus:bg-white text-slate-900 placeholder-slate-400 rounded-full text-xs shadow-sm border border-white/20 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <HugeIcon icon={CancelCircleIcon} size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips & Reset button */}
      {(activeChips.length > 0 || searchQuery || selectedLetter) && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {/* Letter Chip */}
          {selectedLetter && (
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
              <button
                type="button"
                onClick={onRemoveLetter}
                className="hover:text-blue-200 transition-colors cursor-pointer"
                title="Remover filtro de letra"
              >
                <HugeIcon icon={CancelCircleIcon} size={14} />
              </button>
              <span>Letra inicial: &ldquo;{selectedLetter}&rdquo;</span>
            </div>
          )}

          {activeChips.map((chip) => (
            <div
              key={chip.key}
              className="bg-white/95 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-white/30"
            >
              <button
                type="button"
                onClick={() => onRemoveFilter(chip.key)}
                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remover filtro"
              >
                <HugeIcon icon={CancelCircleIcon} size={14} />
              </button>
              <span>{chip.label}</span>
            </div>
          ))}

          {searchQuery && (
            <div className="bg-white/95 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-white/30">
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Limpar busca"
              >
                <HugeIcon icon={CancelCircleIcon} size={14} />
              </button>
              <span>Busca: &ldquo;{searchQuery}&rdquo;</span>
            </div>
          )}

          {/* Remove All */}
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-bold text-blue-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors ml-1"
          >
            <HugeIcon icon={ReloadIcon} size={12} />
            <span>Limpar Todos</span>
          </button>
        </div>
      )}
    </div>
  );
}
