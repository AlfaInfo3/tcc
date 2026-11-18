import Image from 'next/image';
import AdminKanban from '@/components/AdminKanban';
import { getDashboardMetrics, getKanbanData } from '@/lib/dashboard-data';
import DashboardMetrics from './DashboardMetrics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Busca paralela no servidor: evita a cascata servidor → cliente → API → banco.
  const [metrics, kanban] = await Promise.all([
    getDashboardMetrics(),
    getKanbanData(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-border shadow-sm mb-2">
        <div className="absolute inset-0">
          <Image
            src="/Imagens/fachada-laurentino.jpg"
            alt="Fachada do Colégio Estadual Laurentino Martins"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-8 py-6 sm:py-10 lg:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Dashboard Administrativo
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm lg:text-base font-medium mt-1.5 sm:mt-2 max-w-xl">
            Visão geral do sistema da biblioteca do Colégio Estadual Laurentino Martins.
          </p>
        </div>
      </div>

      <DashboardMetrics initialMetrics={metrics} />

      <div className="mt-4">
        <AdminKanban initialData={kanban} />
      </div>
    </div>
  );
}
