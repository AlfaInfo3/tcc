import { SearchInput } from '@/components/ui/search-input';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShieldCheck, Plus, Mail, UserCog, Pencil } from 'lucide-react';
import { TableActions } from '@/components/ui/table-actions';

async function getUsers(query?: string) {
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  return prisma.adminUser.findMany({
    where,
    orderBy: { name: 'asc' }
  });
}

export default async function AdminUsersPage(props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const users = await getUsers(query);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
             Controle de acesso e permissões dos administradores.
          </p>
        </div>
        
         <div className="flex items-center gap-3">
             <Link href="/admin/users/novo" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg border border-transparent font-medium transition-all shadow-sm">
            <Plus size={18} />
            Novo Usuário
          </Link>
        </div>
      </div>

       {/* Filters & Search Bar Area */}
       <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <SearchInput placeholder="Buscar usuário por nome ou email..." />
        <div className="flex gap-2 w-full sm:w-auto">
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Função</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Ações</span></th>
                </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
                {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                             <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-sm border border-border shrink-0">
                                 {user.name.substring(0,2).toUpperCase()}
                             </div>
                             <div className="min-w-0">
                                <span className="font-medium text-foreground block break-words">{user.name}</span>
                                <div className="md:hidden flex flex-col gap-0.5 mt-0.5">
                                    <span className="text-xs text-muted-foreground break-all">{user.email}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs capitalize flex items-center gap-1 text-muted-foreground">
                                            <UserCog size={12} /> {user.role}
                                        </span>
                                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground hidden md:table-cell">
                         <div className="flex items-center gap-2">
                             <Mail size={14} className="opacity-50" />
                             {user.email}
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                         <div className="flex items-center gap-2 text-sm text-foreground capitalize">
                             <UserCog size={16} className="text-neutral-400" />
                             {user.role}
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.isActive 
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TableActions 
                            actions={[
                                { label: 'Editar', icon: <Pencil size={14} />, href: `/admin/users/${user.id}` },
                            ]}
                        />
                      </td>
                </tr>
                ))}
                 {users.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                            <h3 className="text-lg font-medium text-foreground">Nenhum usuário encontrado</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Adicione administradores para gerenciar o sistema.</p>
                             <Link href="/admin/users/novo" className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm border border-transparent font-medium transition-all shadow-sm">
                                 Adicionar Usuário
                            </Link>
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
