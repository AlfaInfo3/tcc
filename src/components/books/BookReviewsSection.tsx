'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  StarIcon, 
  CheckmarkCircle02Icon, 
  Alert02Icon, 
  LoaderCircleIcon, 
  PencilEdit02Icon, 
  SparklesIcon, 
  Cancel01Icon 
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';

export interface SerializedReview {
  id: string;
  bookId: string;
  studentName: string;
  studentClass: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface BookReviewsSectionProps {
  bookId: string;
  bookTitle: string;
  initialReviews?: SerializedReview[];
}

const RATING_LABELS: Record<number, string> = {
  1: '1 estrela · Não gostei',
  2: '2 estrelas · Regular',
  3: '3 estrelas · Bom',
  4: '4 estrelas · Muito bom',
  5: '5 estrelas · Excelente!',
};

export function BookReviewsSection({
  bookId,
  bookTitle,
  initialReviews = [],
}: BookReviewsSectionProps) {
  const [reviews, setReviews] = useState<SerializedReview[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  // Form State
  const [rating, setRating] = useState<number>(5);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [comment, setComment] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percentage };
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!studentName.trim()) {
      newErrors.studentName = 'Informe seu nome';
    } else if (studentName.trim().length < 2) {
      newErrors.studentName = 'Mínimo 2 caracteres';
    }

    if (rating < 1 || rating > 5) {
      newErrors.rating = 'Selecione de 1 a 5 estrelas';
    }

    if (comment.length > 1000) {
      newErrors.comment = 'Máximo 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          studentName: studentName.trim(),
          studentClass: studentClass.trim() || undefined,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar avaliação');
      }

      const createdReview: SerializedReview = {
        ...data.review,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [createdReview, ...prev]);
      setSuccessMessage('Avaliação publicada com sucesso! Obrigado.');
      setComment('');
      setStudentName('');
      setStudentClass('');
      setRating(5);
      
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsFormOpen(false);
        setSuccessMessage('');
        closeTimeoutRef.current = null;
      }, 2500);

    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Falha ao enviar avaliação.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarRating = hoveredStar !== null ? hoveredStar : rating;

  return (
    <section id="avaliacoes" className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl mt-8 scroll-mt-24">
      {/* ── CONTAINER GLASSMORPHIC SEM FUNDO BRANCO ── */}
      <div className="bg-white/[0.04] backdrop-blur-xl rounded-[28px] border border-white/15 shadow-2xl p-5 sm:p-7 lg:p-8 text-white space-y-6">
        
        {/* ── HEADER COMPACTO ─────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold shrink-0">
              <HugeIcon icon={StarIcon} size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                Avaliações do Livro
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-200/80 font-medium">
                {totalReviews} {totalReviews === 1 ? 'avaliação registrada' : 'avaliações registradas'} por alunos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setSuccessMessage('');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs transition-all shadow-md cursor-pointer border border-blue-400/30"
          >
            {isFormOpen ? (
              <>
                <HugeIcon icon={Cancel01Icon} size={14} />
                <span>Fechar</span>
              </>
            ) : (
              <>
                <HugeIcon icon={PencilEdit02Icon} size={14} />
                <span>Avaliar Livro</span>
              </>
            )}
          </button>
        </div>

        {/* ── GRID DE 2 COLUNAS: LADO ESQUERDO (RESUMO) / LADO DIREITO (AVALIAÇÕES OU FORMULÁRIO) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── COLUNA DA ESQUERDA: SCORE & BARRAS COMPACTAS (5 COLS) ── */}
          <div className="lg:col-span-5 bg-white/[0.04] rounded-2xl p-5 border border-white/10 space-y-4">
            
            <div className="flex items-center gap-4">
              <div className="text-center shrink-0">
                <span className="text-4xl font-black text-white leading-none">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center justify-center gap-0.5 mt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HugeIcon
                      icon={StarIcon}
                      key={star}
                      size={14}
                      className={`size-3.5 ${
                        star <= Math.round(averageRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-blue-200/70 block mt-1">
                  de 5.0
                </span>
              </div>

              {/* Barras de Distribuição das Estrelas */}
              <div className="flex-1 space-y-1.5 pl-3 border-l border-white/10">
                {distribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="w-7 text-blue-200/70 flex items-center gap-0.5 justify-end font-mono">
                      <span>{star}</span>
                      <HugeIcon icon={StarIcon} size={10} className="text-amber-400 fill-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-5 text-blue-200/50 text-right font-mono text-[10px]">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-blue-200/60">
              <span className="flex items-center gap-1">
                <HugeIcon icon={SparklesIcon} size={12} className="text-amber-400" />
                Avaliações escolares
              </span>
              <span>Laurentino Martins</span>
            </div>
          </div>

          {/* ── COLUNA DA DIREITA: FORMULÁRIO OU LISTA DE RESENHAS (7 COLS) ── */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Formulário Interativo Inline quando aberto */}
            {isFormOpen ? (
              <div className="bg-white/[0.06] rounded-2xl border border-white/20 p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <HugeIcon icon={PencilEdit02Icon} size={14} className="text-blue-300" />
                    Sua Avaliação para &ldquo;{bookTitle}&rdquo;
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-white/60 hover:text-white p-1 cursor-pointer"
                  >
                    <HugeIcon icon={Cancel01Icon} size={16} />
                  </button>
                </div>

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <HugeIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-400 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errors.submit && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center gap-2">
                    <HugeIcon icon={Alert02Icon} size={16} className="text-rose-400 shrink-0" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Seletor de Estrelas */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="p-0.5 rounded-md hover:scale-120 transition-transform cursor-pointer"
                        >
                          <HugeIcon
                            icon={StarIcon}
                            size={20}
                            className={`size-5 transition-colors ${
                              star <= activeStarRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-white/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {RATING_LABELS[activeStarRating]}
                    </span>
                  </div>

                  {/* Nome e Turma */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Seu Nome Completo *"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className={`w-full px-3 py-2 bg-white/10 rounded-xl border text-xs font-semibold text-white placeholder-blue-200/50 focus:outline-hidden focus:ring-2 transition-all ${
                          errors.studentName
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-white/20 focus:ring-blue-400'
                        }`}
                        required
                      />
                      {errors.studentName && (
                        <p className="text-[10px] font-bold text-rose-300 mt-1">{errors.studentName}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Turma/Série (Ex: 3º A)"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 rounded-xl border border-white/20 text-xs font-semibold text-white placeholder-blue-200/50 focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Comentário */}
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Deixe uma breve opinião sobre o livro (opcional)..."
                      value={comment}
                      maxLength={1000}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-xs font-semibold text-white placeholder-blue-200/50 focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-all resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-white/20 text-blue-200 hover:bg-white/10 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs transition-all shadow-md cursor-pointer border border-blue-400/30"
                    >
                      {isSubmitting ? (
                        <>
                          <HugeIcon icon={LoaderCircleIcon} size={14} className="animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <HugeIcon icon={CheckmarkCircle02Icon} size={14} />
                          <span>Publicar</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {/* Lista das Avaliações dos Alunos */}
            <div className="space-y-3">
              {totalReviews === 0 ? (
                <div className="text-center py-6 px-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 space-y-2">
                  <HugeIcon icon={StarIcon} size={20} className="text-amber-400 fill-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    Nenhuma avaliação ainda para este livro.
                  </p>
                  <p className="text-[11px] text-blue-200/70 font-medium">
                    Seja o primeiro a compartilhar sua experiência de leitura!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all cursor-pointer mt-1"
                  >
                    <HugeIcon icon={PencilEdit02Icon} size={12} />
                    <span>Avaliar agora</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {reviews.map((rev) => {
                    const dateStr = new Date(rev.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      timeZone: 'America/Sao_Paulo',
                    });

                    const initials = rev.studentName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0].toUpperCase())
                        .join('');

                    return (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px] border border-blue-400/30">
                              {initials || 'AL'}
                            </div>
                            <div>
                              <span className="text-xs font-black text-white leading-none block">
                                {rev.studentName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-blue-200/60 mt-0.5">
                                {rev.studentClass && (
                                  <span className="font-bold text-blue-200 bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-400/30">
                                    {rev.studentClass}
                                  </span>
                                )}
                                <span>{dateStr}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 bg-white/10 px-2 py-1 rounded-lg border border-white/15 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HugeIcon
                                icon={StarIcon}
                                key={star}
                                size={12}
                                className={`size-3 ${
                                  star <= rev.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-white/20'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-black text-white ml-1">
                              {rev.rating}.0
                            </span>
                          </div>
                        </div>

                        {rev.comment && (
                          <p className="text-xs text-blue-100 font-medium italic pt-1 pl-2 border-l-2 border-blue-400/40">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
