'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ShieldAlert } from 'lucide-react';

interface EditUserFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  canManage: boolean;
  isSelf: boolean;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

export function EditUserForm({ user, canManage, isSelf }: EditUserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    isActive: user.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload: Record<string, unknown> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
    };

    if (formData.password.trim().length > 0) {
      payload.password = formData.password;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Falha ao salvar as alterações.' });
        return;
      }

      setFormData((current) => ({ ...current, password: '' }));
      setFeedback({ type: 'success', message: 'Alterações salvas com sucesso.' });
      router.refresh();
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!canManage) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
        <p>
          Apenas super administradores podem editar usuários. Você pode visualizar os dados, mas
          não salvar alterações.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          required
          minLength={2}
          className={inputClass}
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className={inputClass}
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          Nova senha
        </label>
        <input
          id="password"
          type="password"
          minLength={8}
          placeholder="Deixe em branco para manter a senha atual"
          className={inputClass}
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
      </div>

      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-foreground">
          Função
        </label>
        <select
          id="role"
          className={inputClass}
          value={formData.role}
          onChange={(event) => setFormData({ ...formData, role: event.target.value })}
        >
          <option value="admin">Administrador (Bibliotecário)</option>
          <option value="super_admin">Super Administrador</option>
        </select>
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          checked={formData.isActive}
          disabled={isSelf}
          onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
        />
        Conta ativa
        {isSelf && (
          <span className="text-xs text-muted-foreground">
            (não é possível desativar a própria conta)
          </span>
        )}
      </label>

      {feedback && (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  );
}
