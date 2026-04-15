'use client';

import { Home, BookOpen, Star, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Início', icon: <Home size={22} />, activeColor: 'text-primary' },
  { id: 'books', label: 'Livros', icon: <BookOpen size={22} />, activeColor: 'text-secondary' },
  { id: 'quests', label: 'Missões', icon: <Star size={22} />, activeColor: 'text-purple' },
  { id: 'profile', label: 'Perfil', icon: <User size={22} />, activeColor: 'text-streak' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#E5E5E5] safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            (tab.id === 'home' && pathname.includes('/dashboard')) ||
            pathname.includes(`/${tab.id}`);

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center min-w-[64px] py-2 px-3 transition-all ${
                isActive
                  ? `${tab.activeColor}`
                  : 'text-muted-foreground'
              }`}
              onClick={() => {
                if (tab.id === 'home') return;
                // Navigation handled by parent
              }}
            >
              <div
                className={`transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? '' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-current mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
