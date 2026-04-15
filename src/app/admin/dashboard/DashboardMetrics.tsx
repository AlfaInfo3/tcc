'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, AlertCircle, Clock } from 'lucide-react';

interface Metrics {
  totalTitles: number;
  totalItems: number;
  availableBooks: number;
  borrowedBooks: number;
  activeLoans: number;
  overdueLoans: number;
  reservations: number;
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metricas')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load metrics', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-lg"></div>)}
    </div>;
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Books */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Acervo Total</p>
          <h3 className="text-2xl font-bold text-foreground">{metrics.totalItems}</h3>
          <p className="text-xs text-muted-foreground/80">{metrics.totalTitles} títulos distintos</p>
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Empréstimos Ativos</p>
          <h3 className="text-2xl font-bold text-foreground">{metrics.activeLoans}</h3>
          <p className="text-xs text-muted-foreground/80">Livros com alunos agora</p>
        </div>
      </div>

       {/* Reservations */}
       <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex items-center">
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Reservas</p>
          <h3 className="text-2xl font-bold text-foreground">{metrics.reservations}</h3>
          <p className="text-xs text-muted-foreground/80">Aguardando retirada</p>
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex items-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Atrasados</p>
          <h3 className="text-2xl font-bold text-red-600">{metrics.overdueLoans}</h3>
          <p className="text-xs text-muted-foreground/80">Precisam de atenção</p>
        </div>
      </div>
    </div>
  );
}
