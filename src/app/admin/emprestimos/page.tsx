// src/app/admin/emprestimos/page.tsx
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getLoans() {
  return prisma.loan.findMany({
    include: {
      book: true,
      student: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function ManageLoansPage() {
  const loans = await getLoans();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Empréstimos</h1>
        <a href="/admin/emprestimos/novo" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Novo Empréstimo (Presencial)
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Livro</th>
              <th className="py-2 px-4 border-b text-left">Aluno</th>
              <th className="py-2 px-4 border-b text-left">Tipo</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Data Prevista</th>
              <th className="py-2 px-4 border-b text-left">Data de Devolução</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{loan.book.title}</td>
                <td className="py-2 px-4 border-b">{loan.student.name}</td>
                <td className="py-2 px-4 border-b">{loan.loanType === 'local' ? 'Local' : 'Online'}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    loan.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : loan.status === 'returned'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {loan.status === 'active' ? 'Emprestado' :
                     loan.status === 'returned' ? 'Devolvido' : 'Atrasado'}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{new Date(loan.dueDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
