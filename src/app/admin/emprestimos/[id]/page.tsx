import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, GraduationCap, Tag } from 'lucide-react';
import { formatDateBR } from '@/lib/format';
import { ReturnLoanButton } from './ReturnLoanButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

function statusInfo(status: string) {
  if (status === 'active') {
    return {
      label: 'Emprestado',
      classes:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    };
  }

  if (status === 'returned') {
    return {
      label: 'Devolvido',
      classes:
        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    };
  }

  return {
    label: 'Atrasado',
    classes:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  };
}

function isLoanOverdue(loan: { status: string; dueDate: Date }) {
  return loan.status === 'active' && loan.dueDate.getTime() < Date.now();
}

export default async function AdminLoanDetailsPage({ params }: Props) {
  const { id } = await params;

  const loan = await prisma.loan.findUnique({
    where: { id },
    include: { book: true, student: true },
  });

  if (!loan) notFound();

  const status = statusInfo(loan.status);
  const isOverdue = isLoanOverdue(loan);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Link
        href="/admin/emprestimos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para empréstimos
      </Link>

      <div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Detalhes do empréstimo</h1>
          <p className="text-muted-foreground mt-1">
            Retirado em {formatDateBR(loan.loanDate)} · {loan.loanType === 'local' ? 'Empréstimo local' : 'Empréstimo online'}
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.classes}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen size={16} />
            Livro
          </h2>
          <p className="text-lg font-semibold text-foreground break-words">{loan.book.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {loan.book.author || 'Autor não informado'}
          </p>
          <Link
            href={`/admin/livros/${loan.book.id}`}
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
          <p className="text-lg font-semibold text-foreground break-words">{loan.student.name}</p>
          <p className="text-sm text-muted-foreground mt-1">Turma: {loan.student.class}</p>
          <Link
            href={`/admin/alunos/${loan.student.id}`}
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Ver ficha do aluno
          </Link>
        </section>
      </div>

      <section className="mt-4 bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Calendar size={16} />
          Prazos
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Data de retirada</dt>
            <dd className="font-medium text-foreground">{formatDateBR(loan.loanDate)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Devolução prevista</dt>
            <dd className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {formatDateBR(loan.dueDate)}
              {isOverdue && ' · em atraso'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Devolução efetiva</dt>
            <dd className="font-medium text-foreground">{formatDateBR(loan.returnDate)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Modalidade</dt>
            <dd className="flex items-center gap-1.5 font-medium text-foreground">
              <Tag size={14} className="text-muted-foreground" />
              {loan.loanType === 'local' ? 'Local' : 'Online'}
            </dd>
          </div>
        </dl>
      </section>

      {loan.status !== 'returned' && (
        <div className="mt-4">
          <ReturnLoanButton loanId={loan.id} />
        </div>
      )}
    </div>
  );
}
