import { Book, Flame, Star, Trophy } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function StatCard({ icon, value, label, color, bgColor, borderColor }: StatCardProps) {
  return (
    <div className={`card-duo p-4 flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 active:scale-95 ${bgColor} ${borderColor}`}>
      <div className={`mb-2 ${color}`}>{icon}</div>
      <span className="text-3xl font-black text-foreground">{value}</span>
      <span className="text-xs font-bold text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

export function StatGrid({
  totalReads,
  streak,
  badges,
  currentLoans,
}: {
  totalReads: number;
  streak: number;
  badges: number;
  currentLoans: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={<Book size={28} />}
        value={totalReads}
        label="Livros Lidos"
        color="text-secondary"
        bgColor="bg-blue-50 dark:bg-blue-900/20"
        borderColor="border-blue-200 dark:border-blue-700"
      />
      <StatCard
        icon={<Flame size={28} className="flame-animate" />}
        value={streak}
        label="Dias Seguida"
        color="text-streak"
        bgColor="bg-orange-50 dark:bg-orange-900/20"
        borderColor="border-orange-200 dark:border-orange-700"
      />
      <StatCard
        icon={<Trophy size={28} />}
        value={badges}
        label="Conquistas"
        color="text-gold"
        bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        borderColor="border-yellow-200 dark:border-yellow-700"
      />
      <StatCard
        icon={<Star size={28} />}
        value={currentLoans}
        label="Lendo Agora"
        color="text-purple"
        bgColor="bg-purple-50 dark:bg-purple-900/20"
        borderColor="border-purple-200 dark:border-purple-700"
      />
    </div>
  );
}
