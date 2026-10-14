'use client';

import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  PenLine, 
  User, 
  GraduationCap, 
  Sparkles,
  ChevronDown,
  Quote
} from 'lucide-react';

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
      newErrors.studentName = 'Informe seu nome completo';
    } else if (studentName.trim().length < 2) {
      newErrors.studentName = 'O nome deve ter no mínimo 2 caracteres';
    }

    if (rating < 1 || rating > 5) {
      newErrors.rating = 'Selecione uma nota de 1 a 5 estrelas';
    }

    if (comment.length > 1000) {
      newErrors.comment = 'O comentário não pode passar de 1000 caracteres';
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
      setSuccessMessage('Sua avaliação foi publicada com sucesso! Obrigado por compartilhar.');
      setComment('');
      setStudentName('');
      setStudentClass('');
      setRating(5);
      
      // Auto-hide form after success after short delay
      setTimeout(() => {
        setIsFormOpen(false);
      }, 3000);

    } catch (err: any) {
      setErrors({ submit: err.message || 'Falha ao enviar avaliação. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarRating = hoveredStar !== null ? hoveredStar : rating;

  return (
    <section id="avaliacoes" className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl mt-12 scroll-mt-24">
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] border border-white/40 shadow-2xl p-6 sm:p-10 lg:p-12 text-slate-800 space-y-10">
        
        {/* ── HEADER DA SEÇÃO ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="size-3.5 text-amber-500 fill-amber-500" />
              Opinião dos Alunos & Leitores
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Avaliações e Resenhas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Veja a opinião de quem já leu &ldquo;{bookTitle}&rdquo; e compartilhe sua experiência literária.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setSuccessMessage('');
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg self-start sm:self-auto cursor-pointer"
          >
            <PenLine className="size-4" />
            <span>{isFormOpen ? 'Fechar Formulário' : 'Avaliar este Livro'}</span>
          </button>
        </div>

        {/* ── RESUMO DAS NOTAS (RATING OVERVIEW) ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
          
          {/* Nota Geral em Destaque */}
          <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-600">
              {totalReviews === 0
                ? 'Sem avaliações registradas ainda'
                : `Baseado em ${totalReviews} ${totalReviews === 1 ? 'avaliação de aluno' : 'avaliações de alunos'}`}
            </p>
          </div>

          {/* Barras de Distribuição das Estrelas */}
          <div className="md:col-span-8 space-y-2.5">
            {distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 text-xs font-bold">
                <span className="w-12 text-slate-600 flex items-center gap-1 justify-end font-mono">
                  {star} <Star className="size-3 text-amber-500 fill-amber-500 inline" />
                </span>
                <div className="flex-1 h-3 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-14 text-slate-500 text-right font-mono text-[11px]">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORMULÁRIO DE AVALIAÇÃO (ACCORDION EXPANSÍVEL) ─ */}
        {isFormOpen && (
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-3xl border-2 border-blue-200 p-6 sm:p-8 space-y-6 shadow-inner animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PenLine className="size-5 text-blue-600" />
                  Deixe sua Avaliação e Opinião
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Sua avaliação ajuda outros colegas a escolherem a melhor leitura escolar!
                </p>
              </div>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errors.submit && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center gap-3">
                <AlertCircle className="size-5 text-rose-600 shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seletor Interativo de Estrelas */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Sua Nota para este Livro:
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                        aria-label={`Avaliar com ${star} estrelas`}
                      >
                        <Star
                          className={`size-7 transition-colors ${
                            star <= activeStarRating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100/70 text-amber-900 border border-amber-200">
                    {RATING_LABELS[activeStarRating]}
                  </span>
                </div>
              </div>

              {/* Grid: Nome e Turma */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="review-name" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Seu Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="review-name"
                      type="text"
                      placeholder="Ex: Mariana Silva"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                        errors.studentName
                          ? 'border-rose-300 focus:ring-rose-400'
                          : 'border-slate-200 focus:ring-blue-500'
                      }`}
                      required
                    />
                  </div>
                  {errors.studentName && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.studentName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="review-class" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Sua Turma ou Série <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="review-class"
                      type="text"
                      placeholder="Ex: 3º B Técnico em Informática"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Comentário / Resenha */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="review-comment" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Sua Opinião sobre o Livro <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {comment.length}/1000
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="Conte o que achou da história, personagens, aprendizados ou por que outros alunos deveriam ler..."
                  value={comment}
                  maxLength={1000}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                />
              </div>

              {/* Botão de Envio */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-black text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>Publicar Avaliação</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ── LISTAGEM DAS AVALIAÇÕES EXISTENTES ───────────── */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <MessageSquare className="size-4 text-blue-600" />
            Opiniões dos Alunos ({totalReviews})
          </h3>

          {totalReviews === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
              <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Star className="size-6 text-amber-500 fill-amber-500" />
              </div>
              <h4 className="text-base font-black text-slate-800">
                Ainda não há avaliações para este livro
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Você já leu esta obra? Seja o primeiro aluno a avaliar e ajude a guiar seus colegas em novas leituras!
              </p>
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                <PenLine className="size-3.5" />
                <span>Avaliar agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((rev) => {
                const dateStr = new Date(rev.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                // Initials for avatar
                const initials = rev.studentName
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0].toUpperCase())
                  .join('');

                return (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          {initials || 'AL'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">
                            {rev.studentName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {rev.studentClass && (
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {rev.studentClass}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-slate-400">
                              {dateStr}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Estrelas da avaliação individual */}
                      <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-3.5 ${
                              star <= rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-slate-700 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Comentário */}
                    {rev.comment && (
                      <div className="pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white/60 p-3.5 rounded-xl border border-slate-100 flex items-start gap-2.5">
                        <Quote className="size-4 text-blue-400 shrink-0 mt-0.5 rotate-180 opacity-60" />
                        <p className="whitespace-pre-line italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
