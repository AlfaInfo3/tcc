import Link from 'next/link';
import { ArrowLeft, CalendarX2 } from 'lucide-react';

export default function ReservationNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/admin/reservas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Voltar para reservas
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <CalendarX2 size={26} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Reserva não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O registro pode ter sido removido ou o endereço está desatualizado.
        </p>
        <Link
          href="/admin/reservas"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver todas as reservas
        </Link>
      </div>
    </div>
  );
}
