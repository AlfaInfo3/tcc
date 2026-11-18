import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, GraduationCap, Medal, Trophy, Pencil } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';
import { SearchInput } from '@/components/ui/search-input';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

async function getStudents(query: string, page: number) {
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { class: { contains: query, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        loans: { where: { status: 'active' }, select: { id: true } },
        profile: { select: { xp: true, level: true } },
      },
    }),
    prisma.student.count({ where }),
  ]);

  return { students, total };
}

/** Ranking global por XP, independente da busca ou da página atual. */
async function getGlobalRanks() {
  const profiles = await prisma.studentProfile.findMany({
    orderBy: [{ xp: 'desc' }, { createdAt: 'asc' }],
    select: { studentId: true },
  });

  return new Map(profiles.map((profile, index) => [profile.studentId, index + 1]));
}

function buildPageHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `/admin/alunos?${search}` : '/admin/alunos';
}

export default async function AdminStudentsPage(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.trim() || '';
  const parsedPage = Number.parseInt(searchParams?.page || '1', 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [{ students, total }, globalRanks] = await Promise.all([
    getStudents(query, page),
    getGlobalRanks(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Controle de matrículas e gamificação dos leitores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/alunos/novo"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg border border-transparent font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Adicionar Aluno
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchInput placeholder="Buscar aluno por nome ou turma..." />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {total} {total === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Rank</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aluno</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Turma</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Gamificação</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Ativos</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {students.map((student) => {
                const hasProfile = !!student.profile;
                const rank = globalRanks.get(student.id) ?? null;
                const isTop3 = rank !== null && rank <= 3;
                const activeLoans = student.loans.length;

                return (
                  <tr key={student.id} className={`transition-colors ${isTop3 ? 'bg-amber-50/40 dark:bg-amber-900/10' : 'hover:bg-muted/50'}`}>
                    {/* Rank */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                        rank === 2 ? 'bg-slate-100 text-slate-700 ring-2 ring-slate-200' :
                        rank === 3 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {rank ?? '-'}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center border font-bold text-sm mr-3 ${isTop3 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-secondary text-secondary-foreground border-border'}`}>
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground flex items-center gap-1 break-words">
                            {student.name}
                            {rank === 1 && <Trophy size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex flex-col gap-0.5 md:hidden">
                            <span>{student.class}</span>
                            {hasProfile && (
                              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                <Medal size={12} />
                                {student.profile?.xp} XP • Nível {student.profile?.level}
                              </span>
                            )}
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              {activeLoans} {activeLoans === 1 ? 'ativo' : 'ativos'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium">{student.class}</span>
                    </td>

                    {/* Gamification */}
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      {hasProfile ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                            <Medal size={14} />
                            {student.profile?.xp} XP
                          </div>
                          <span className="text-xs text-muted-foreground">Nível {student.profile?.level}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                          Sem perfil
                        </span>
                      )}
                    </td>

                    {/* Counts */}
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {activeLoans} {activeLoans === 1 ? 'ativo' : 'ativos'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <TableActions
                        actions={[
                          { label: 'Detalhes', icon: <Pencil size={14} />, href: `/admin/alunos/${student.id}` },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium text-foreground">Nenhum aluno encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {query ? 'Tente outro nome ou turma.' : 'Cadastre os alunos para acompanhar empréstimos e ranking.'}
                    </p>
                    <Link
                      href="/admin/alunos/novo"
                      className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm border border-transparent font-medium transition-all shadow-sm"
                    >
                      Cadastrar Aluno
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
              Página {page} de {totalPages} • {total} {total === 1 ? 'aluno' : 'alunos'}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageHref(page - 1, query)}
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
                  href={buildPageHref(page + 1, query)}
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
