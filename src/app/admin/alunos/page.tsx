import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getStudents() {
  const students = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    include: { 
        _count: { select: { loans: true, reservations: true } },
        profile: { select: { xp: true, level: true } }
    }
  });

  // Sort: 1. Has Profile? 2. XP (Desc) 3. Name (Asc)
  // Create a new array to avoid in-place mutation issues (though findMany returns fresh array)
  return [...students].sort((a, b) => {
      const hasProfileA = a.profile ? 1 : 0;
      const hasProfileB = b.profile ? 1 : 0;
      
      if (hasProfileA !== hasProfileB) return hasProfileB - hasProfileA; // Profile first
      if (hasProfileA) {
          // Both have profile, sort by XP
          const xpDiff = (b.profile?.xp || 0) - (a.profile?.xp || 0);
          if (xpDiff !== 0) return xpDiff;
      }
      return a.name.localeCompare(b.name);
  });
}

export default async function AdminStudentsPage() {
  const students = await getStudents();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Alunos</h1>
          <a href="/admin/alunos/novo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Adicionar Aluno
          </a>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP / Nível</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empréstimos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => {
               const hasProfile = !!student.profile;
               const rank = hasProfile ? index + 1 : null;
               
               let rankIcon = null;
               let isTop3 = false;

               if (rank) {
                   if (rank === 1) rankIcon = <span className="text-xl" title="1º Lugar">🥇</span>;
                   else if (rank === 2) rankIcon = <span className="text-xl" title="2º Lugar">🥈</span>;
                   else if (rank === 3) rankIcon = <span className="text-xl" title="3º Lugar">🥉</span>;
                   else rankIcon = <span className="text-gray-400 font-mono">#{rank}</span>;
                   isTop3 = rank <= 3;
               } else {
                   rankIcon = <span className="text-gray-300">-</span>;
               }

               return (
                  <tr key={student.id} className={isTop3 ? 'bg-yellow-50/50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8">
                           {rankIcon}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {student.name}
                        {isTop3 && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">Top {rank}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{student.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {hasProfile ? (
                            <div className="flex flex-col">
                                <span className="font-bold text-indigo-600">{student.profile.xp} XP</span>
                                <span className="text-xs text-gray-400">Nível {student.profile.level}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Sem perfil</span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <span title="Empréstimos Ativos">{student._count.loans}</span> 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                        <a href={`/admin/alunos/${student.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                            Histórico
                        </a>
                    </td>
                  </tr>
               );
            })}
             {students.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
