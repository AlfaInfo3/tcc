import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getReservations() {
  return prisma.reservation.findMany({
    include: {
      book: true,
      student: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function AdminReservationsPage() {
  const reservations = await getReservations();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Histórico de Reservas</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="px-6 py-4 whitespace-nowrap">{res.book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{res.student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        res.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                        res.status === 'completed' || res.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {res.status === 'reserved' ? 'Solicitado' : 
                         res.status === 'completed' ? 'Atendido' : 
                         res.status === 'confirmed' ? 'Confirmado' : res.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(res.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma reserva encontrada no histórico.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
