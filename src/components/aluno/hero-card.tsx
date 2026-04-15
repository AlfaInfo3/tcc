import { Trophy, ArrowUp } from 'lucide-react';
import { OwlMascot } from './owl-mascot';

interface HeroProgressCardProps {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
}

export function HeroProgressCard({ level, xp, nextLevelXp, streak }: HeroProgressCardProps) {
  const progress = Math.min(100, ((xp % 100) / 100) * 100);
  const xpInCurrentLevel = xp % 100;
  const remaining = 100 - xpInCurrentLevel;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl border-b-4 border-primary-dark">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <OwlMascot size={160} className="translate-x-8 -translate-y-4" />
      </div>

      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <Trophy className="text-gold" size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-white/80">Seu Nível</p>
              <h2 className="text-3xl font-black">Nível {level}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flame-animate">
              <path d="M12 2C8 8 4 12 4 16C4 20 7.6 22 12 22C16.4 22 20 20 20 16C20 12 16 8 12 2Z" fill="#FF9600" />
              <path d="M12 10C10 13 8 15 8 17C8 19 9.8 20 12 20C14.2 20 16 19 16 17C16 15 14 13 12 10Z" fill="#FFC800" />
            </svg>
            <span className="font-black text-sm">{streak} dias</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold text-white/90">
            <span>XP Atual: {xp}</span>
            <span>Próximo: {nextLevelXp} XP</span>
          </div>

          <div className="w-full bg-black/20 rounded-full h-5 border border-white/20 overflow-hidden">
            <div
              className="bg-gold h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-white/70">
              Faltam {remaining} XP para o nível {level + 1}
            </p>
            <ArrowUp size={14} className="text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
