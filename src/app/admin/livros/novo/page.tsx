'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Sparkles, 
  Barcode, 
  Upload, 
  Camera, 
  Check, 
  X, 
  Plus, 
  Minus, 
  BookOpen, 
  Loader2, 
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { BookSearchResult } from '@/lib/book-search';
import { QuickBookRegisterModal } from '@/components/admin/QuickBookRegisterModal';
import { Modal } from '@/components/ui/modal';

export default function NewBookPage() {
  const router = useRouter();

  // Quick Modal Trigger
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: '',
    quantity: 1,
    coverUrl: '',
    genres: [] as string[],
    description: '',
    corridor: '',
    shelf: '',
    shelfLevel: '',
  });

  // Tag Input State
  const [currentGenreInput, setCurrentGenreInput] = useState('');
  const [existingGenres, setExistingGenres] = useState<string[]>([]);
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);

  // Cover custom state
  const [customCoverDataUrl, setCustomCoverDataUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Camera capture state
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop the camera stream if the page unmounts while capturing.
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // Inline feedback (replaces native alert dialogs)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search/Autocomplete State
  const [suggestions, setSuggestions] = useState<BookSearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load existing genres for autocomplete
  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => setExistingGenres(data))
      .catch((err) => console.error('Failed to load genres', err));
  }, []);

  // Debounced search for title or ISBN (unified PT-BR)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.title.length >= 2 && showSuggestions) {
        setLoadingSearch(true);
        try {
          const response = await fetch(`/api/livros/search?q=${encodeURIComponent(formData.title)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoadingSearch(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.title, showSuggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelectBook = (book: BookSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      title: book.title,
      author: book.authors.join(', '),
      isbn: book.isbn || prev.isbn,
      publishedYear: book.publishedYear?.toString() || prev.publishedYear,
      coverUrl: book.coverUrl || prev.coverUrl,
      description: book.description || prev.description,
      genres: book.genres && book.genres.length > 0 
        ? Array.from(new Set([...prev.genres, ...book.genres])) 
        : prev.genres,
    }));
    setCustomCoverDataUrl(null);
    setCoverFile(null);
    setShowSuggestions(false);
  };

  // ── PHOTO CAMERA CAPTURE ─────────────────────────────────────
  const startPhotoCamera = async () => {
    setIsCapturingPhoto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error opening camera:', err);
      setFeedback({
        type: 'error',
        message: 'Não foi possível acessar a câmera. Você também pode carregar uma imagem do seu dispositivo.',
      });
      setIsCapturingPhoto(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCustomCoverDataUrl(dataUrl);
      setCoverFile(null);
    }
    stopPhotoCamera();
  };

  const stopPhotoCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCapturingPhoto(false);
  };

  // ── SAVE BOOK ────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent, continueAdding = false) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      setFeedback({ type: 'error', message: 'Título e autor são obrigatórios.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      let finalCoverUrl = customCoverDataUrl || formData.coverUrl;

      // Handle Image Upload if file exists
      if (coverFile) {
        const uploadData = new FormData();
        uploadData.append('file', coverFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalCoverUrl = url;
        }
      }

      const response = await fetch('/api/livros/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverUrl: finalCoverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
          publishedAt: parseInt(formData.publishedYear) || undefined,
          quantity: Math.max(1, parseInt(formData.quantity.toString()) || 1),
          description: formData.description || `Publicado em ${formData.publishedYear || '?'}`,
          genres: formData.genres.length > 0 ? formData.genres : ['Geral'],
        }),
      });

      if (response.ok) {
        if (continueAdding) {
          setFormData({
            title: '',
            author: '',
            isbn: '',
            publishedYear: '',
            quantity: 1,
            coverUrl: '',
            genres: [],
            description: '',
            corridor: '',
            shelf: '',
            shelfLevel: '',
          });
          setCustomCoverDataUrl(null);
          setCoverFile(null);
          setFeedback({ type: 'success', message: 'Livro cadastrado com sucesso! Pronto para cadastrar o próximo.' });
        } else {
          router.push('/admin/livros');
          router.refresh();
        }
      } else {
        const errData = await response.json();
        setFeedback({ type: 'error', message: `Erro ao salvar: ${errData.error || 'Erro desconhecido'}` });
      }
    } catch (error) {
      console.error('Error saving book:', error);
      setFeedback({ type: 'error', message: 'Erro de conexão ao salvar livro.' });
    } finally {
      setSaving(false);
    }
  };

  const activeCover = customCoverDataUrl || (coverFile ? URL.createObjectURL(coverFile) : null) || formData.coverUrl;

  return (
    <div className="w-full bg-slate-50/60 font-quicksand">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ── TOP NAV BAR ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/livros"
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Voltar aos Livros"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Cadastrar Novo Livro
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Catálogo inteligente com busca automática em português e capas em alta resolução
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQuickModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer border border-slate-900/10"
          >
            <Barcode size={17} className="text-slate-300" />
            <span>Escanear Código de Barras</span>
          </button>
        </div>

        {/* ── TWO-COLUMN FORM LAYOUT ───────────────────────────── */}
        <form onSubmit={(e) => handleSave(e, false)} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT COLUMN: METADATA FORM (8 cols) ────────────── */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            
            {/* Title / Smart Autocomplete Input */}
            <div className="relative" ref={wrapperRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Título da Obra ou ISBN *
                </label>
                <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                  <Sparkles size={13} />
                  <span>Busca Automática PT-BR</span>
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o título ou código ISBN para autocompletar..."
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all pr-10"
                  autoComplete="off"
                />
                {loadingSearch && (
                  <div className="absolute right-3.5 top-3.5">
                    <Loader2 size={18} className="animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-slate-200 mt-2 rounded-2xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {suggestions.map((book, index) => (
                    <li
                      key={`${book.isbn}-${index}`}
                      onClick={() => handleSelectBook(book)}
                      className="p-3 hover:bg-blue-50/80 cursor-pointer transition-colors flex items-center gap-3.5"
                    >
                      {book.coverUrl ? (
                        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image src={book.coverUrl} alt={book.title} fill sizes="40px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen size={16} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 text-xs sm:text-sm truncate">{book.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{book.authors.join(', ')}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {book.publishedYear && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {book.publishedYear}
                            </span>
                          )}
                          {book.source && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                              {book.source.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Author and Published Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Autor(es) *
                </label>
                <input
                  type="text"
                  placeholder="Nome do(s) autor(es)"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Ano de Publicação
                </label>
                <input
                  type="number"
                  placeholder="Ex: 2024"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* ISBN and Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  ISBN / Código de Barras
                </label>
                <input
                  type="text"
                  placeholder="ISBN-10 ou ISBN-13"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Quantidade de Exemplares
                </label>
                <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                    className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full text-center bg-transparent font-black text-sm text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                    className="p-2.5 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Localização física (opcional) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Localização Física <span className="font-medium normal-case tracking-normal text-slate-400">(opcional)</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  ['corridor', 'Corredor', 'Ex.: C'],
                  ['shelf', 'Estante', 'Ex.: 1'],
                  ['shelfLevel', 'Prateleira', 'Ex.: 2'],
                ] as const).map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Opcional. Livros sem localização continuam aparecendo normalmente no acervo.
              </p>
            </div>

            {/* Genres Tag Input */}
            <div className="relative">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                Gêneros e Categorias
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-2xl min-h-[46px] items-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white">
                {formData.genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, genres: formData.genres.filter((_, i) => i !== idx) })}
                      className="hover:text-blue-950 font-bold text-sm cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="relative flex-1 min-w-[130px]">
                  <input
                    type="text"
                    placeholder={formData.genres.length === 0 ? 'Ex: Ficção, História (Enter para adicionar)' : ''}
                    value={currentGenreInput}
                    onChange={(e) => {
                      setCurrentGenreInput(e.target.value);
                      setShowGenreSuggestions(true);
                    }}
                    onFocus={() => setShowGenreSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if (currentGenreInput.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            genres: [...prev.genres, currentGenreInput.trim()],
                          }));
                          setCurrentGenreInput('');
                          setShowGenreSuggestions(false);
                        }
                      }
                    }}
                    className="w-full outline-none text-xs font-bold text-slate-800 bg-transparent px-2"
                  />

                  {/* Suggestions for Genres */}
                  {showGenreSuggestions && currentGenreInput.length > 0 && (
                    <ul className="absolute left-0 bottom-full mb-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto z-10">
                      {existingGenres
                        .filter(
                          (g) =>
                            g.toLowerCase().includes(currentGenreInput.toLowerCase()) &&
                            !formData.genres.includes(g)
                        )
                        .map((g, i) => (
                          <li
                            key={i}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                genres: [...prev.genres, g],
                              }));
                              setCurrentGenreInput('');
                              setShowGenreSuggestions(false);
                            }}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-xs font-bold text-slate-700"
                          >
                            {g}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Synopsis / Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Sinopse / Resumo (PT-BR)
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {formData.description.length} caracteres
                </span>
              </div>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Sinopse da obra em português..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
              />
            </div>

            {/* Form Action Buttons */}
            {feedback && (
              <p
                className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
                  feedback.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {feedback.message}
              </p>
            )}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={saving || !formData.title.trim() || !formData.author.trim()}
                className="w-full sm:flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} className="stroke-[3]" />}
                <span>Salvar Livro no Acervo</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSave(e, true)}
                disabled={saving || !formData.title.trim() || !formData.author.trim()}
                className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                Salvar e Adicionar Outro
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: INTERACTIVE COVER PREVIEW (4 cols) ─ */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">
                Capa do Livro
              </h3>

              {/* Cover Display Card */}
              <div className="relative w-44 h-64 rounded-2xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200 flex items-center justify-center group mb-4">
                {activeCover ? (
                  <>
                    <Image src={activeCover} alt="Capa do livro" fill sizes="176px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={startPhotoCamera}
                        className="p-2.5 bg-white text-slate-900 rounded-xl hover:scale-105 transition-transform"
                        title="Tirar nova foto"
                      >
                        <Camera size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, coverUrl: '' });
                          setCustomCoverDataUrl(null);
                          setCoverFile(null);
                        }}
                        className="p-2.5 bg-rose-600 text-white rounded-xl hover:scale-105 transition-transform"
                        title="Remover capa"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                    <ImageIcon size={36} className="mb-2 stroke-[1.5]" />
                    <p className="text-xs font-bold text-slate-500">Sem Capa</p>
                    <p className="text-[10px] text-slate-400">Busque pelo título ou fotografe</p>
                  </div>
                )}
              </div>

              {/* Cover Controls */}
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={startPhotoCamera}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera size={14} />
                  <span>Tirar Foto</span>
                </button>

                <label className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <Upload size={14} />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setCoverFile(file);
                      setCustomCoverDataUrl(null);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {coverFile && (
                <p className="text-[11px] text-emerald-600 font-bold mt-2 truncate max-w-full flex items-center gap-1">
                  <Check className="size-3.5 shrink-0" />
                  <span className="truncate">{coverFile.name}</span>
                </p>
              )}

              {/* Live Preview Summary */}
              <div className="w-full mt-5 pt-4 border-t border-slate-100 text-left">
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">
                  Prévia no Catálogo
                </p>
                <h4 className="font-black text-sm text-slate-900 line-clamp-1">
                  {formData.title || 'Título do Livro'}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {formData.author || 'Autor da obra'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {formData.quantity} exemplares
                  </span>
                  {formData.genres[0] && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {formData.genres[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ── LIVE PHOTO CAMERA MODAL ─────────────────────────── */}
        <Modal
          isOpen={isCapturingPhoto}
          onClose={stopPhotoCamera}
          className="max-w-md border-slate-800 bg-slate-900 p-5 text-white"
        >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <Camera size={16} />
                  <span>Aponte para a capa física e clique em Fotografar</span>
                </div>
                <button
                  type="button"
                  onClick={stopPhotoCamera}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black max-h-[360px] flex items-center justify-center">
                <video ref={videoRef} className="w-full h-auto object-contain" autoPlay playsInline muted />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Camera size={16} />
                  <span>Fotografar Capa</span>
                </button>
                <button
                  type="button"
                  onClick={stopPhotoCamera}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
        </Modal>

        {/* ── QUICK REGISTER MODAL (TRIGGERED FROM NEW BOOK PAGE) ─ */}
        <QuickBookRegisterModal
          isOpen={quickModalOpen}
          onClose={() => setQuickModalOpen(false)}
          onBookCreated={() => {
            router.push('/admin/livros');
            router.refresh();
          }}
        />

      </div>
    </div>
  );
}
