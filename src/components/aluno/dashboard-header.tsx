'use client';

import { LogOut } from 'lucide-react';
import { XpBadge } from './xp-progress';
import { OwlMascotSmall } from './owl-mascot';

interface DashboardHeaderProps {
  username: string;
  studentName: string;
  level: number;
  xp: number;
  streak: number;
  onLogout: () => void;
}

export function DashboardHeader({
  username,
  studentName,
  xp,
  streak,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-[#E5E5E5] safe-top">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <OwlMascotSmall size={24} />
          </div>
          <div className="hidden sm:block leading-tight">
            <h1 className="font-black text-foreground text-sm">{username}</h1>
            <p className="text-xs text-muted-foreground">{studentName}</p>
          </div>
        </div>

        {/* Center: Streak + XP (always visible) */}
        <XpBadge xp={xp} streak={streak} />

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-danger min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
