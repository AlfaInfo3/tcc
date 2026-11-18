import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { Plus, FileText, User, Calendar, Pencil } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';
import { formatDateBR } from '@/lib/format';
import { SearchInput } from '@/components/ui/search-input';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Emprestados' },
  { value: 'returned', label: 'Devolvidos' },
  { value: 'overdue', label: 'Atrasados' },
] as const;

type LoanStatusFilter = Exclude<(typeof STATUS_OPTIONS)[number]['value'], ''>;

async function getLoans(query: string, status: LoanStatusFilter | '', page: number) {
  const filters: Prisma.LoanWhereInput[] = [];

  if (query) {
    filters.push({
      OR: [
        { student: { name: { contains: query, mode: 'insensitive' } } },
        { book: { title: { contains: query, mode: 'insensitive' } } },
      ],
    });
  }

  if (status === 'overdue') {
    filters.push({
      OR: [
        { status: 'overdue' },
        { status: 'active', dueDate: { lt: new Date() } },
      ],
    });
  } else if (status) {
    filters.push({ status });
  }

  const where: Prisma.LoanWhereInput = filters.length ? { AND: filters } : {};

  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
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
    prisma.loan.count({ where }),
  ]);

  return { loans, total };
}

function buildPageHref(page: number, query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status) params.set('status', status);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `/admin/emprestimos?${search}` : '/admin/emprestimos';
}

export default async function ManageLoansPage(props: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.trim() || '';
  const statusParam = searchParams?.status || '';
  const status = STATUS_OPTIONS.some((option) => option.value === statusParam)
    ? (statusParam as LoanStatusFilter | '')
    : '';
  const parsedPage = Number.parseInt(searchParams?.page || '1', 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { loans, total } = await getLoans(query, status, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const now = new Date();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Empréstimos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe e gerencie todos os livros emprestados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/emprestimos/novo"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg border border-transparent font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Novo Empréstimo
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col gap-4">
        <SearchInput placeholder="Buscar por aluno ou livro..." />
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
            {total} {total === 1 ? 'empréstimo encontrado' : 'empréstimos encontrados'}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Livro</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Aluno</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Datas</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loans.map((loan) => {
                const isOverdue = loan.status === 'active' && new Date(loan.dueDate) < now;
                const displayStatus = loan.status === 'returned' ? 'returned' : isOverdue ? 'overdue' : loan.status;

                return (
                  <tr key={loan.id} className="hover:bg-muted/50 transition-colors">
                    {/* Book Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="ml-4 min-w-0">
                          <Link
                            href={`/admin/livros/${loan.bookId}`}
                            className="text-sm font-medium text-foreground break-words hover:text-primary hover:underline"
                          >
                            {loan.book.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">ID: {loan.bookId.substring(0, 8)}...</div>

                          <div className="md:hidden mt-1 text-xs text-muted-foreground flex flex-col gap-0.5">
                            <Link href={`/admin/alunos/${loan.studentId}`} className="flex items-center gap-1 font-medium text-foreground/80 hover:text-primary hover:underline">
                              <User size={12} /> {loan.student.name}
                            </Link>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} /> Prev: {formatDateBR(loan.dueDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <Link href={`/admin/alunos/${loan.studentId}`} className="flex items-center group">
                        <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold mr-3 uppercase">
                          {loan.student.name.substring(0, 2)}
                        </div>
                        <div className="text-sm text-foreground group-hover:text-primary group-hover:underline">{loan.student.name}</div>
                      </Link>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        displayStatus === 'active'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                          : displayStatus === 'returned'
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          displayStatus === 'active' ? 'bg-amber-500' :
                          displayStatus === 'returned' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {displayStatus === 'active' ? 'Emprestado' :
                         displayStatus === 'returned' ? 'Devolvido' : 'Atrasado'}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1 pl-1">
                        {loan.loanType === 'local' ? 'Local' : 'Online'}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                          Previsto: {formatDateBR(loan.dueDate)}
                        </div>
                        {loan.returnDate && (
                          <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                            <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                            Devolvido: {formatDateBR(loan.returnDate)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <TableActions
                        actions={[
                          { label: 'Detalhes', icon: <Pencil size={14} />, href: `/admin/emprestimos/${loan.id}` },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}

              {loans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium text-foreground">Nenhum empréstimo encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {query || status ? 'Ajuste a busca ou o filtro de status.' : 'Comece criando um novo empréstimo para os alunos.'}
                    </p>
                    <Link
                      href="/admin/emprestimos/novo"
                      className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm border border-transparent font-medium transition-all shadow-sm"
                    >
                      Criar primeiro empréstimo
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} • {total} {total === 1 ? 'empréstimo' : 'empréstimos'}
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
