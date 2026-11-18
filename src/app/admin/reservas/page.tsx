import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CalendarArrowUp, Calendar, User, BookOpen, Eye } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';
import { formatDateBR } from '@/lib/format';
import { SearchInput } from '@/components/ui/search-input';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'reserved', label: 'Solicitadas' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Atendidas' },
] as const;

type ReservationStatus = Exclude<(typeof STATUS_OPTIONS)[number]['value'], ''>;

async function getReservations(query: string, status: ReservationStatus | '', page: number) {
  const filters: Prisma.ReservationWhereInput[] = [];

  if (query) {
    filters.push({
      OR: [
        { student: { name: { contains: query, mode: 'insensitive' } } },
        { book: { title: { contains: query, mode: 'insensitive' } } },
      ],
    });
  }

  if (status === 'completed') {
    // Reservas atendidas: estado atual (confirmed) e legado (completed).
    filters.push({ status: { in: ['confirmed', 'completed'] } });
  } else if (status) {
    filters.push({ status });
  }

  const where: Prisma.ReservationWhereInput = filters.length ? { AND: filters } : {};

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      include: {
        book: true,
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.reservation.count({ where }),
  ]);

  return { reservations, total };
}

function buildPageHref(page: number, query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status) params.set('status', status);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `/admin/reservas?${search}` : '/admin/reservas';
}

export default async function AdminReservationsPage(props: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    erro?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.trim() || '';
  const statusParam = searchParams?.status || '';
  const status = STATUS_OPTIONS.some((option) => option.value === statusParam)
    ? (statusParam as ReservationStatus | '')
    : '';
  const parsedPage = Number.parseInt(searchParams?.page || '1', 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { reservations, total } = await getReservations(query, status, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Histórico de Reservas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as solicitações e histórico de reservas de livros.
          </p>
        </div>
      </div>

      {searchParams?.erro === 'reserva-removida' && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
        >
          A reserva que você tentou abrir não existe mais. Selecione uma reserva da lista abaixo.
        </div>
      )}

      {/* Filters & Search Bar Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col gap-4">
        <SearchInput placeholder="Buscar em reservas..." />
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = status === option.value;
            return (
              <Link
                key={option.value || 'all'}
                href={buildPageHref(1, query, option.value)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/70'
                }`}
              >
                {option.label}
              </Link>
            );
          })}
          <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap">
            {total} {total === 1 ? 'reserva encontrada' : 'reservas encontradas'}
          </span>
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
                        <Link
                          href={`/admin/livros/${res.bookId}`}
                          className="font-medium text-foreground block break-words hover:text-primary hover:underline"
                        >
                          {res.book.title}
                        </Link>
                        <div className="block md:hidden mt-0.5 text-xs text-muted-foreground">
                          <Link href={`/admin/alunos/${res.studentId}`} className="flex items-center gap-1 hover:text-primary hover:underline">
                            <User size={12} className="opacity-70" /> {res.student.name}
                          </Link>
                          <span className="flex items-center gap-1 mt-0.5">
                            <Calendar size={12} className="opacity-70" /> {formatDateBR(res.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <Link
                      href={`/admin/alunos/${res.studentId}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline"
                    >
                      <User size={14} className="opacity-50" />
                      {res.student.name}
                    </Link>
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
                      {formatDateBR(res.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <TableActions
                      actions={[
                        { label: 'Detalhes', icon: <Eye size={14} />, href: `/admin/reservas/${res.id}` },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <CalendarArrowUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium text-foreground">Nenhuma reserva encontrada</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {query || status ? 'Ajuste a busca ou o filtro de status.' : 'O histórico de reservas aparecerá aqui.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} • {total} {total === 1 ? 'reserva' : 'reservas'}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageHref(page - 1, query, status)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Anterior
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                  Anterior
                </span>
              )}
              {page < totalPages ? (
                <Link
                  href={buildPageHref(page + 1, query, status)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Próxima
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                  Próxima
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
