'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Barcode, Sparkles } from 'lucide-react';
import { QuickBookRegisterModal } from './QuickBookRegisterModal';

export function AdminLivrosHeader() {
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={() => setQuickModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer border border-slate-900/10"
        >
          <Barcode size={16} className="text-slate-300" />
          <span>Escanear Código de Barras</span>
        </button>

        <Link
          href="/admin/livros/novo"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Novo Livro</span>
        </Link>
      </div>

      <QuickBookRegisterModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        onBookCreated={() => {
          router.refresh();
        }}
      />
    </>
  );
}
