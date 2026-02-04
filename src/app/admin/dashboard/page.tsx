import AdminKanban from '@/components/AdminKanban';
import DashboardMetrics from './DashboardMetrics';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      <DashboardMetrics />
      
      {/* Kanban Board */}
      <AdminKanban />
    </div>
  );
}
