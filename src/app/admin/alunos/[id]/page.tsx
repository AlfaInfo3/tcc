import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatDateBR } from '@/lib/format';

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
        orderBy: { createdAt: 'desc' },
      },
      reservations: {
        include: { book: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export default async function StudentDetailsPage({ params }: Props) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) notFound();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Link
        href="/admin/alunos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para alunos
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{student.name}</h1>
        <p className="text-muted-foreground mt-1">Turma: {student.class}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Loans Section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
            Histórico de empréstimos
          </h2>
          {student.loans.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum empréstimo registrado.</p>
          ) : (
            <div className="space-y-4">
              {student.loans.map((loan) => (
                <div key={loan.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground break-words">{loan.book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Retirado em: {formatDateBR(loan.loanDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        loan.status === 'active'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : loan.status === 'returned'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {loan.status === 'active' ? 'Emprestado' : loan.status === 'returned' ? 'Devolvido' : 'Atrasado'}
                    </span>
                  </div>
                  {loan.returnDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Devolvido em: {formatDateBR(loan.returnDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reservations Section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
            Histórico de reservas
          </h2>
          {student.reservations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma reserva registrada.</p>
          ) : (
            <div className="space-y-4">
              {student.reservations.map((reservation) => (
                <div key={reservation.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground break-words">{reservation.book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Data: {formatDateBR(reservation.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        reservation.status === 'reserved'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : reservation.status === 'completed' || reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {reservation.status === 'reserved'
                        ? 'Solicitado'
                        : reservation.status === 'completed'
                          ? 'Atendido'
                          : reservation.status === 'confirmed'
                            ? 'Confirmado'
                            : reservation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
