import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { formatDateBR, formatDateTimeBR } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  reserved: 'Solicitado',
  confirmed: 'Confirmado',
  completed: 'Atendido',
  cancelled: 'Cancelado',
};

function statusClasses(status: string) {
  if (status === 'reserved') {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
  }

  if (status === 'confirmed' || status === 'completed') {
    return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
  }

  return 'bg-muted text-muted-foreground border-border';
}

export default async function AdminReservationDetailsPage({ params }: Props) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { book: true, student: true },
  });

  if (!reservation) notFound();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Link
        href="/admin/reservas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para reservas
      </Link>

      <div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Detalhes da reserva</h1>
          <p className="text-muted-foreground mt-1">
            Pedido realizado em {formatDateTimeBR(reservation.createdAt)}
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(reservation.status)}`}
        >
          {STATUS_LABELS[reservation.status] ?? reservation.status}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen size={16} />
            Livro
          </h2>
          <p className="text-lg font-semibold text-foreground break-words">{reservation.book.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {reservation.book.author || 'Autor não informado'}
          </p>
          <Link
            href={`/admin/livros/${reservation.book.id}`}
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Ver livro no acervo
          </Link>
        </section>

        <section className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <GraduationCap size={16} />
            Aluno
          </h2>
          <p className="text-lg font-semibold text-foreground break-words">{reservation.student.name}</p>
          <p className="text-sm text-muted-foreground mt-1">Turma: {reservation.student.class}</p>
          <Link
            href={`/admin/alunos/${reservation.student.id}`}
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Ver ficha do aluno
          </Link>
        </section>
      </div>

      <section className="mt-4 bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Calendar size={16} />
          Datas
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Data do pedido</dt>
            <dd className="font-medium text-foreground">{formatDateBR(reservation.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Identificador</dt>
            <dd className="font-mono text-xs text-foreground break-all">{reservation.id}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
