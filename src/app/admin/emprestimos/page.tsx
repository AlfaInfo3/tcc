import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { Plus, Search, Filter, MoreHorizontal, FileText, User, Calendar, Pencil, CheckCircle } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';

export const dynamic = 'force-dynamic';

import { SearchInput } from '@/components/ui/search-input';

async function getLoans(query?: string) {
  const where = query ? {
    OR: [
      { student: { name: { contains: query, mode: 'insensitive' as const } } },
      { book: { title: { contains: query, mode: 'insensitive' as const } } }
    ]
  } : {};

  return prisma.loan.findMany({
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

export default async function ManageLoansPage(props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  console.log('Loans Search Query:', query);
  const loans = await getLoans(query);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gerenciar Empréstimos
          </h1>
          <p className="text-muted-foreground mt-1">
             Acompanhe e gerencie todos os livros emprestados.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <a href="/admin/emprestimos/novo" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg border border-transparent font-medium transition-all shadow-sm">
            <Plus size={18} />
            Novo Empréstimo
          </a>
        </div>
      </div>

      {/* Filters & Search Bar Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchInput placeholder="Buscar por aluno ou livro..." />
        <div className="flex gap-2 w-full sm:w-auto">
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
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-muted/50 transition-colors">
                  {/* Book Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="text-sm font-medium text-foreground break-words">{loan.book.title}</div>
                        <div className="text-xs text-muted-foreground">ID: {loan.bookId.substring(0, 8)}...</div>
                        
                        <div className="md:hidden mt-1 text-xs text-muted-foreground flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 font-medium text-foreground/80">
                                <User size={12} /> {loan.student.name}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={12} /> Prev: {new Date(loan.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Student Info */}
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center">
                         <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold mr-3 uppercase">
                             {loan.student.name.substring(0, 2)}
                         </div>
                        <div className="text-sm text-foreground">{loan.student.name}</div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      loan.status === 'active'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        : loan.status === 'returned'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            loan.status === 'active' ? 'bg-amber-500' :
                            loan.status === 'returned' ? 'bg-green-500' : 'bg-red-500' 
                        }`}></span>
                      {loan.status === 'active' ? 'Emprestado' :
                       loan.status === 'returned' ? 'Devolvido' : 'Atrasado'}
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
                             Previsto: {new Date(loan.dueDate).toLocaleDateString()}
                        </div>
                        {loan.returnDate && (
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                                <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                                Devolvido: {new Date(loan.returnDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <TableActions 
                        actions={[
                            { label: 'Editar', icon: <Pencil size={14} />, href: `/admin/emprestimos/${loan.id}` },
                            // { label: 'Devolver', icon: <CheckCircle size={14} />, onClick: () => console.log('Return loan', loan.id) }
                        ]}
                    />
                  </td>
                </tr>
              ))}
              
              {loans.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-medium text-foreground">Nenhum empréstimo encontrado</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Comece criando um novo empréstimo para os alunos.</p>
                         <a href="/admin/emprestimos/novo" className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm border border-transparent font-medium transition-all shadow-sm">
                             Criar primeiro empréstimo
                        </a>
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
