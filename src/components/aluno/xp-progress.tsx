interface XpProgressProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
  showLabel?: boolean;
}

export function XpProgress({ currentXp, nextLevelXp, level, showLabel = true }: XpProgressProps) {
  const progress = Math.min(100, ((currentXp % 100) / 100) * 100);
  const xpInCurrentLevel = currentXp % 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border-2 border-gold">
                <span className="text-sm font-black text-gold-dark">{level}</span>
              </div>
              <span className="font-bold text-sm text-foreground">Nível {level}</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {xpInCurrentLevel}/{100} XP
            </span>
          </>
        )}
      </div>

      <div className="w-full bg-muted rounded-full h-4 border-2 border-border overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out xp-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Circular XP badge for top bar
 */
export function XpBadge({ xp, streak }: { xp: number; streak: number }) {
  return (
    <div className="flex items-center gap-3">
      {/* Streak Flame */}
      <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border-2 border-orange-200 flame-animate">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8 8 4 12 4 16C4 20 7.6 22 12 22C16.4 22 20 20 20 16C20 12 16 8 12 2Z" fill="#FF9600" />
          <path d="M12 10C10 13 8 15 8 17C8 19 9.8 20 12 20C14.2 20 16 19 16 17C16 15 14 13 12 10Z" fill="#FFC800" />
        </svg>
        <span className="text-sm font-black text-streak-dark">{streak}</span>
      </div>

      {/* XP Count */}
      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border-2 border-yellow-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFC800" />
          <text x="12" y="16" textAnchor="middle" fill="#E0AC00" fontSize="10" fontWeight="bold">XP</text>
        </svg>
        <span className="text-sm font-black text-gold-dark">{xp}</span>
      </div>
    </div>
  );
}
