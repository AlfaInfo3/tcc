import React from 'react';
import { Calendar, BookOpen, Clock, CheckCircle2, Bookmark, AlertTriangle } from 'lucide-react';

interface HistoryItem {
  id?: string;
  book: { title: string; author: string };
  status: string;
  loanType?: string;
  dueDate?: string;
  createdAt?: string;
  loanDate?: string;
}

interface ReadingHistoryProps {
  currentLoans: HistoryItem[];
  history: HistoryItem[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  active: { label: 'Emprestado', color: 'text-primary', bgColor: 'bg-primary/10', icon: <BookOpen size={18} className="text-primary" /> },
  returned: { label: 'Devolvido', color: 'text-muted-foreground', bgColor: 'bg-muted', icon: <CheckCircle2 size={18} className="text-muted-foreground" /> },
  reserved: { label: 'Solicitado', color: 'text-streak', bgColor: 'bg-streak/10', icon: <Bookmark size={18} className="text-streak" /> },
  overdue: { label: 'Atrasado', color: 'text-danger', bgColor: 'bg-danger/10', icon: <AlertTriangle size={18} className="text-danger" /> },
};

export function CurrentLoansSection({ loans }: { loans: HistoryItem[] }) {
  if (!loans || loans.length === 0) {
    return (
      <div className="card-duo p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-muted flex items-center justify-center">
          <BookOpen className="text-muted-foreground" size={28} />
        </div>
        <p className="font-bold text-foreground text-sm">Nenhuma leitura ativa</p>
        <p className="text-xs text-muted-foreground mt-1">Explore a biblioteca para encontrar seu próximo livro!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {loans
        .filter((loan) => loan.status === 'active')
        .map((loan) => {
          const config = statusConfig[loan.status] || statusConfig.active;
          return (
            <div key={loan.id || loan.book.title} className="card-duo p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0 text-lg`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground line-clamp-1">{loan.book.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{loan.book.author}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                    {loan.loanType && (
                      <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 rounded-lg bg-muted">
                        {loan.loanType === 'online' ? 'Online' : 'Presencial'}
                      </span>
                    )}
                    {loan.dueDate && (
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(loan.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export function HistoryFeed({ items }: { items: HistoryItem[] }) {
  const sortedItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.loanDate || 0).getTime() -
        new Date(a.createdAt || a.loanDate || 0).getTime()
    )
    .slice(0, 8);

  if (sortedItems.length === 0) {
    return (
      <div className="card-duo p-6 text-center">
        <Clock className="mx-auto text-muted-foreground mb-2" size={28} />
        <p className="font-bold text-foreground text-sm">Sem histórico ainda</p>
        <p className="text-xs text-muted-foreground mt-1">Suas leituras aparecerão aqui!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedItems.map((item, idx) => {
        const config = statusConfig[item.status] || statusConfig.returned;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-all"
          >
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              item.status === 'active' ? 'bg-primary' :
              item.status === 'returned' ? 'bg-muted-foreground' :
              item.status === 'reserved' ? 'bg-streak' : 'bg-danger'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground line-clamp-1">{item.book.title}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
              {new Date(item.createdAt || item.loanDate || Date.now()).toLocaleDateString('pt-BR')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ReadingHistory({ currentLoans, history }: ReadingHistoryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Current Loans */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
            <BookOpen className="text-primary" size={14} />
          </div>
          <h2 className="font-black text-lg text-foreground">Lendo Agora</h2>
        </div>
        <CurrentLoansSection loans={currentLoans} />
      </div>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="text-muted-foreground" size={14} />
          </div>
          <h2 className="font-black text-lg text-foreground">Atividade Recente</h2>
        </div>
        <div className="card-duo p-2">
          <HistoryFeed items={history} />
        </div>
      </div>
    </div>
  );
}
