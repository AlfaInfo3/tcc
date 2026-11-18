'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function ReturnLoanButton({ loanId }: { loanId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReturn = async () => {
    const confirmed = window.confirm('Confirmar a devolução deste empréstimo?');
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/emprestimos/devolucao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Não foi possível registrar a devolução.');
        return;
      }

      router.refresh();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Devolução</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ao registrar a devolução, o exemplar volta automaticamente para o estoque do acervo.
      </p>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleReturn}
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        {loading ? 'Registrando...' : 'Registrar devolução'}
      </button>
    </div>
  );
}
