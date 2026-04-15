import { prisma } from '@/lib/prisma';
import { CalendarArrowUp, Search, Filter, Calendar, User, BookOpen, Eye, Ban } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';

export const dynamic = 'force-dynamic';

import { SearchInput } from '@/components/ui/search-input';

async function getReservations(query?: string) {
  const where = query ? {
    OR: [
      { student: { name: { contains: query, mode: 'insensitive' as const } } },
      { book: { title: { contains: query, mode: 'insensitive' as const } } }
    ]
  } : {};

  return prisma.reservation.findMany({
    where,
    include: {
      book: true,
      student: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function AdminReservationsPage(props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  console.log('Reservations Search Query:', query);
  const reservations = await getReservations(query);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Histórico de Reservas
          </h1>
          <p className="text-muted-foreground mt-1">
             Gerencie as solicitações e histórico de reservas de livros.
          </p>
        </div>
      </div>

       {/* Filters & Search Bar Area */}
       <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchInput placeholder="Buscar em reservas..." />
        <div className="flex gap-2 w-full sm:w-auto">
             
        </div>
      </div>
      
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Livro</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Aluno</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Data do Pedido</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Ações</span></th>
                </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
                {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <BookOpen size={16} />
                            </div>
                            <div className="min-w-0">
                                <span className="font-medium text-foreground block break-words">{res.book.title}</span>
                                <div className="block md:hidden mt-0.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User size={12} className="opacity-70" /> {res.student.name}
                                    </span>
                                    <span className="flex items-center gap-1 mt-0.5">
                                        <Calendar size={12} className="opacity-70" /> {new Date(res.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User size={14} className="opacity-50" />
                            {res.student.name}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            res.status === 'reserved' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' 
                            : res.status === 'completed' || res.status === 'confirmed' 
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                                : 'bg-muted text-muted-foreground border-border'
                        }`}>
                             <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                res.status === 'reserved' ? 'bg-amber-500' :
                                res.status === 'completed' || res.status === 'confirmed' ? 'bg-green-500' : 'bg-neutral-500' 
                            }`}></span>
                            {res.status === 'reserved' ? 'Solicitado' : 
                             res.status === 'completed' ? 'Atendido' : 
                             res.status === 'confirmed' ? 'Confirmado' : res.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                         <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="opacity-50" />
                            {new Date(res.createdAt).toLocaleDateString()}
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TableActions 
                            actions={[
                                { label: 'Detalhes', icon: <Eye size={14} />, href: `/admin/reservas/${res.id}` },
                                // { label: 'Cancelar', icon: <Ban size={14} />, variant: 'destructive', onClick: () => console.log('Cancel reservation', res.id) }
                            ]}
                        />
                    </td>
                </tr>
                ))}
                {reservations.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                            <CalendarArrowUp className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                            <h3 className="text-lg font-medium text-foreground">Nenhuma reserva encontrada</h3>
                            <p className="mt-1 text-sm text-muted-foreground">O histórico de reservas aparecerá aqui.</p>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
