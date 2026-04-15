import AdminKanban from '@/components/AdminKanban';
import DashboardMetrics from './DashboardMetrics';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-border shadow-sm mb-2">
        <div className="absolute inset-0">
          <img 
            src="https://www.rvcfm.com.br/images/2025/11/20251113173318_l_WhatsAppImage2025-11-13at14.15.401.jpg" 
            alt="Colégio Estadual Laurentino Martins" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-8 py-10 lg:py-12">
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            Dashboard Administrativo
          </h1>
          <p className="text-blue-100 font-medium mt-2 max-w-xl">
            Visão geral do sistema da biblioteca do Colégio Estadual Laurentino Martins.
          </p>
        </div>
      </div>
      
      <DashboardMetrics />
      
      <div className="mt-4">
        {/* Kanban Board */}
        <AdminKanban />
      </div>
    </div>
  );
}
