import { Trophy, Book, Flame, Star, Award, Target } from 'lucide-react';

const badgeIcons: Record<string, React.ReactNode> = {
  first_read: <Book className="text-white" size={24} />,
  streak_7: <Flame className="text-white" size={24} />,
  level_5: <Trophy className="text-white" size={24} />,
  default: <Star className="text-white" size={24} />,
};

function getBadgeIcon(badge: string) {
  const key = badge.toLowerCase();
  if (key.includes('first') || key.includes('primeiro')) return badgeIcons.first_read;
  if (key.includes('streak') || key.includes('sequencia')) return badgeIcons.streak_7;
  if (key.includes('level') || key.includes('nivel')) return badgeIcons.level_5;
  return badgeIcons.default;
}

const badgeColors = [
  'from-primary to-primary-light',
  'from-secondary to-blue-400',
  'from-streak to-yellow-400',
  'from-purple to-pink',
  'from-gold to-orange-400',
];

export function AchievementBadge({
  badge,
  size = 'md',
}: {
  badge: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const colorIndex = badge.length % badgeColors.length;
  const gradient = badgeColors[colorIndex];

  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg border-2 border-white/30 transition-transform group-hover:scale-110 group-active:scale-95`}
      >
        {getBadgeIcon(badge)}
      </div>
      <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight max-w-[72px] line-clamp-2">
        {badge}
      </span>
    </div>
  );
}

export function BadgeGrid({ badges }: { badges: string[] }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto text-muted-foreground mb-2" size={40} />
        <p className="text-sm font-bold text-muted-foreground">
          Nenhuma conquista ainda. Continue lendo!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge, index) => (
        <div key={index} className="slide-up" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}>
          <AchievementBadge badge={badge} />
        </div>
      ))}
    </div>
  );
}
