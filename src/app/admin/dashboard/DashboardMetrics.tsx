'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen01Icon, UserGroupIcon, Alert02Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import type { DashboardMetricsData } from '@/lib/dashboard-data';

export default function DashboardMetrics({
  initialMetrics,
  refreshVersion,
}: {
  initialMetrics?: DashboardMetricsData;
  refreshVersion?: number;
}) {
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(initialMetrics ?? null);
  const [loading, setLoading] = useState(!initialMetrics);

  useEffect(() => {
    if (initialMetrics) return;
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
  }, [initialMetrics]);

  // Recarrega os cards quando o Kanban conclui uma movimentação.
  const lastVersionRef = useRef(refreshVersion ?? 0);
  useEffect(() => {
    if (refreshVersion === undefined || refreshVersion === lastVersionRef.current) return;
    lastVersionRef.current = refreshVersion;

    fetch('/api/metricas')
      .then((res) => res.json())
      .then((data: DashboardMetricsData) => setMetrics(data))
      .catch((err) => console.error('Falha ao atualizar métricas', err));
  }, [refreshVersion]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-lg"></div>)}
    </div>;
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {/* Total Books */}
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xs border border-border flex items-center">
        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-100 text-blue-600 mr-3.5 sm:mr-4 shrink-0">
          <HugeIcon icon={BookOpen01Icon} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Acervo Total</p>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{metrics.totalItems}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 truncate">{metrics.totalTitles} títulos distintos</p>
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xs border border-border flex items-center">
        <div className="p-2.5 sm:p-3 rounded-xl bg-green-100 text-green-600 mr-3.5 sm:mr-4 shrink-0">
          <HugeIcon icon={UserGroupIcon} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Empréstimos Ativos</p>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{metrics.activeLoans}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 truncate">Livros com alunos agora</p>
        </div>
      </div>

       {/* Reservations */}
       <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xs border border-border flex items-center">
        <div className="p-2.5 sm:p-3 rounded-xl bg-yellow-100 text-yellow-600 mr-3.5 sm:mr-4 shrink-0">
          <HugeIcon icon={Clock01Icon} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Reservas</p>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{metrics.reservations}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 truncate">Aguardando retirada</p>
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xs border border-border flex items-center">
        <div className="p-2.5 sm:p-3 rounded-xl bg-red-100 text-red-600 mr-3.5 sm:mr-4 shrink-0">
          <HugeIcon icon={Alert02Icon} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Atrasados</p>
          <h3 className="text-xl sm:text-2xl font-bold text-red-600">{metrics.overdueLoans}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 truncate">Precisam de atenção</p>
        </div>
      </div>
    </div>
  );
}
