'use client';

import { 
  LibraryIcon, 
  BookOpen01Icon, 
  Clock01Icon, 
  Search01Icon, 
  Home01Icon 
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import Link from 'next/link';

interface NavRailProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function NavRail({ activeTab = 'books', onTabChange }: NavRailProps) {
  const navItems = [
    { id: 'books', label: 'Livros', icon: LibraryIcon },
    { id: 'last', label: 'Destaques', icon: BookOpen01Icon },
    { id: 'recent', label: 'Recentes', icon: Clock01Icon },
    { id: 'search', label: 'Buscar', icon: Search01Icon },
  ];

  return (
    <aside className="w-[76px] shrink-0 bg-white/95 backdrop-blur-md rounded-[26px] flex flex-col items-center justify-between py-6 px-1 shadow-xl border border-white/30 select-none">
      {/* Top Navigation Items */}
      <div className="flex flex-col items-center gap-7 w-full">
        {/* Home shortcut */}
        <Link
          href="/"
          title="Voltar ao Início"
          className="flex flex-col items-center justify-center w-full group cursor-pointer text-slate-500 hover:text-blue-700 transition-colors"
        >
          <div className="p-1 rounded-xl group-hover:bg-blue-50 transition-colors">
            <HugeIcon icon={Home01Icon} size={20} className="transition-transform duration-200 group-hover:scale-110" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">
            Início
          </span>
        </Link>

        <div className="w-8 h-px bg-slate-200" />

        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange?.(item.id)}
              className={`flex flex-col items-center justify-center w-full group cursor-pointer transition-colors ${
                isActive ? 'text-blue-900' : 'text-slate-500 hover:text-blue-700'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'group-hover:bg-slate-100'}`}>
                <HugeIcon 
                  icon={IconComponent}
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-105' : 'group-hover:scale-105'
                  }`} 
                />
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-black text-blue-950' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-6 h-[3px] bg-blue-600 rounded-full mt-1 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Profile avatar removed completely per user request */}
      <div className="py-2" />
    </aside>
  );
}
