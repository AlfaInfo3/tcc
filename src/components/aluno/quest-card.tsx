import { Check, Star, Zap, Target } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  desc: string;
  progress: number;
  total: number;
  xp: number;
  completed: boolean;
}

const questIcons: Record<string, React.ReactNode> = {
  read: <Star className="text-purple" size={20} />,
  streak: <Zap className="text-streak" size={20} />,
  default: <Target className="text-secondary" size={20} />,
};

function getQuestIcon(quest: Quest) {
  const key = quest.title.toLowerCase();
  if (key.includes('streak') || key.includes('sequencia')) return questIcons.streak;
  if (key.includes('read') || key.includes('ler') || key.includes('livro')) return questIcons.read;
  return questIcons.default;
}

export function QuestCard({ quest }: { quest: Quest }) {
  const progressPercent = Math.min(100, (quest.progress / quest.total) * 100);

  return (
    <div
      className={`card-duo p-4 transition-all ${
        quest.completed
          ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            quest.completed
              ? 'bg-green-100 dark:bg-green-900/40'
              : 'bg-muted dark:bg-muted'
          }`}
        >
          {quest.completed ? (
            <Check className="text-green-600" size={20} />
          ) : (
            getQuestIcon(quest)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground truncate">{quest.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{quest.desc}</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2.5 border border-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  quest.completed ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
              {quest.progress}/{quest.total}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-black text-purple">+{quest.xp} XP</span>
          {quest.completed && (
            <span className="text-[10px] font-black text-green-600 uppercase tracking-wide">
              Completo!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuestList({ quests }: { quests: Quest[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
