'use client';

import { useState } from 'react';
import { 
  Cancel01Icon, 
  Bookmark01Icon, 
  CheckmarkCircle02Icon, 
  Alert02Icon, 
  LoaderCircleIcon 
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import type { BookItem } from './BookCardWithHover';

interface ReserveModalProps {
  book: BookItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReserveModal({ book, isOpen, onClose, onSuccess }: ReserveModalProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!className.trim()) {
      setError('Por favor, informe sua turma ou série (ex: 1º A).');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          name: name.trim(),
          className: className.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar reserva.');
      }

      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setClassName('');
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar reserva. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in-0 duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100 z-10 text-slate-800 font-['Quicksand',sans-serif] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Fechar"
        >
          <HugeIcon icon={Cancel01Icon} size={18} />
        </button>

        {/* Modal Header with Book Preview */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100 pr-8">
          <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 shadow-md">
            <img
              src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
              <HugeIcon icon={Bookmark01Icon} size={11} />
              Reserva Escolar
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
              {book.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
              {book.author}
            </p>
            {book.quantity !== undefined && (
              <span className="inline-block text-[11px] font-bold text-emerald-700 mt-1">
                {book.quantity} exemplares no acervo
              </span>
            )}
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="size-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
              <HugeIcon icon={CheckmarkCircle02Icon} size={32} />
            </div>
            <h4 className="text-lg font-black text-slate-900">Reserva Confirmada!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              O livro <strong>{book.title}</strong> foi reservado no seu nome. Dirija-se à biblioteca escolar para retirar seu exemplar.
            </p>
          </div>
        ) : (
          /* Reservation Form */
          <form onSubmit={handleSubmit} className="pt-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <HugeIcon icon={Alert02Icon} size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="reserve-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nome Completo do Aluno
              </label>
              <input
                id="reserve-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva Gomes"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="reserve-class" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Turma / Série
              </label>
              <input
                id="reserve-class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: 3º Ano B - Matutino"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <HugeIcon icon={LoaderCircleIcon} size={14} className="animate-spin" />
                    <span>Confirmando...</span>
                  </>
                ) : (
                  <>
                    <HugeIcon icon={Bookmark01Icon} size={14} />
                    <span>Confirmar Reserva</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
