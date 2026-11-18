'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';

type Feedback = { type: 'success' | 'error' | 'warning'; message: string } | null;

export default function NewStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    class: string;
    username?: string;
    password?: string;
  }>({ name: '', class: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/alunos/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/alunos');
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        const existing = data.student
          ? ` Nome: ${data.student.name} · Turma: ${data.student.class}.`
          : '';
        setFeedback({
          type: 'warning',
          message: `Este aluno já está cadastrado.${existing}`,
        });
        return;
      }

      setFeedback({ type: 'error', message: data.error || 'Erro ao cadastrar aluno.' });
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        href="/admin/alunos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para alunos
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Adicionar aluno</h1>
        <p className="text-muted-foreground mt-1">Cadastre a matrícula e, se necessário, o acesso gamificado.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            required
            className={inputClass}
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="class" className="mb-1.5 block text-sm font-medium text-foreground">
            Turma
          </label>
          <input
            id="class"
            type="text"
            required
            placeholder="Ex: 3º Ano A"
            className={inputClass}
            value={formData.class}
            onChange={(event) => setFormData({ ...formData, class: event.target.value })}
          />
        </div>

        <div className="border-t border-border pt-4 mt-6">
          <h2 className="text-sm font-semibold text-foreground">Acesso gamificado (opcional)</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Preencha usuário e senha apenas se o aluno for usar o aplicativo.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                className={inputClass}
                value={formData.username || ''}
                onChange={(event) => setFormData({ ...formData, username: event.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                id="password"
                type="password"
                minLength={6}
                className={inputClass}
                value={formData.password || ''}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              />
            </div>
          </div>
        </div>

        {feedback && (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              feedback.type === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? 'Salvando...' : 'Cadastrar aluno'}
        </button>
      </form>
    </div>
  );
}
