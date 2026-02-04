import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

async function getStudent(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      loans: {
        include: { book: true },
        orderBy: { createdAt: 'desc' }
      },
      reservations: {
        include: { book: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export default async function StudentDetailsPage({ params }: Props) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-gray-600">Turma: {student.class}</p>
        </div>
        <Link href="/admin/alunos" className="text-blue-600 hover:underline">
            ← Voltar para Lista
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Loans Section */}
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Histórico de Empréstimos</h2>
            {student.loans.length === 0 ? (
                <p className="text-gray-500">Nenhum empréstimo registrado.</p>
            ) : (
                <div className="space-y-4">
                    {student.loans.map(loan => (
                        <div key={loan.id} className="border-b last:border-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{loan.book.title}</p>
                                    <p className="text-xs text-gray-500">
                                        Retirado em: {new Date(loan.loanDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    loan.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                    loan.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {loan.status === 'active' ? 'Emprestado' :
                                     loan.status === 'returned' ? 'Devolvido' : 'Atrasado'}
                                </span>
                            </div>
                            {loan.returnDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Devolvido em: {new Date(loan.returnDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Reservations Section */}
        <div className="bg-white rounded-lg shadow p-6">
             <h2 className="text-xl font-bold mb-4 border-b pb-2">Histórico de Reservas</h2>
             {student.reservations.length === 0 ? (
                <p className="text-gray-500">Nenhuma reserva registrada.</p>
            ) : (
                <div className="space-y-4">
                    {student.reservations.map(res => (
                        <div key={res.id} className="border-b last:border-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{res.book.title}</p>
                                    <p className="text-xs text-gray-500">
                                        Data: {new Date(res.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    res.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                                    res.status === 'completed' || res.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                     {res.status === 'reserved' ? 'Solicitado' : 
                                     res.status === 'completed' ? 'Atendido' : 
                                     res.status === 'confirmed' ? 'Confirmado' : res.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
