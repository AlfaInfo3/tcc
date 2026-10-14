'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkCheck, Loader2 } from 'lucide-react';

interface ReserveFormProps {
  bookId: string;
}

export function ReserveForm({ bookId }: ReserveFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    className: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, informe seu nome completo.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!formData.className.trim()) {
      newErrors.className = 'Por favor, informe sua turma ou série.';
    } else if (formData.className.trim().length < 1) {
      newErrors.className = 'A turma não pode estar vazia.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          className: formData.className.trim(),
          bookId
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Falha na reserva');
      }

      setFormData({ name: '', className: '' });
      setSuccessMessage('Reserva realizada com sucesso! Retire seu exemplar na biblioteca.');

      setTimeout(() => {
        router.push('/livros');
      }, 2500);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Erro ao realizar a reserva. Por favor, tente novamente ou procure a secretaria.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Nome Completo do Aluno
        </label>
        <input
          type="text"
          id="student-name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white transition-all outline-none ${
            errors.name 
              ? 'border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/20' 
              : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          placeholder="Ex: Maria Clara Souza"
        />
        {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="student-class" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Turma / Ano Escolar
        </label>
        <input
          type="text"
          id="student-class"
          value={formData.className}
          onChange={(e) => {
            setFormData({ ...formData, className: e.target.value });
            if (errors.className) setErrors(prev => ({ ...prev, className: '' }));
          }}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white transition-all outline-none ${
            errors.className 
              ? 'border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/20' 
              : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          placeholder="Ex: 9º Ano B ou 3º E.M."
        />
        {errors.className && <p className="text-red-500 text-xs font-semibold mt-1">{errors.className}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errors.submit}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <BookmarkCheck className="size-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || Boolean(successMessage)}
        className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
          isSubmitting || successMessage
            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
            : 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer hover:shadow-md'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Processando Reserva...</span>
          </>
        ) : successMessage ? (
          <span>Reserva Confirmada!</span>
        ) : (
          <>
            <BookmarkCheck className="size-4 text-[#FFD166]" />
            <span>Confirmar Reserva de Exemplar</span>
          </>
        )}
      </button>
    </form>
  );
}