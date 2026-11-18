'use client';

import { useCallback, useState } from 'react';
import AdminKanban from '@/components/AdminKanban';
import type { DashboardMetricsData, KanbanApiData } from '@/lib/dashboard-data';
import DashboardMetrics from './DashboardMetrics';

/**
 * Mantém métricas e quadro na mesma versão de dados: toda movimentação
 * concluída no Kanban dispara o recarregamento das métricas.
 */
export default function DashboardLive({
  metrics,
  kanban,
}: {
  metrics: DashboardMetricsData;
  kanban: KanbanApiData;
}) {
  const [version, setVersion] = useState(0);
  const handleMutated = useCallback(() => setVersion((current) => current + 1), []);

  return (
    <>
      <DashboardMetrics initialMetrics={metrics} refreshVersion={version} />

      <div className="mt-4">
        <AdminKanban initialData={kanban} onMutated={handleMutated} />
      </div>
    </>
  );
}
