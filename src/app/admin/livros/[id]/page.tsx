'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Trash2, 
  Save, 
  Upload, 
  Camera, 
  Globe, 
  Plus, 
  Minus, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  Image as ImageIcon,
  BookOpen,
  Check,
  X,
  Languages,
  Sparkles
} from 'lucide-react';
import { ModernBookCover, BookHeader, BookTitle, BookDescription } from '@/cuicui/other/books/modern-book-cover/modern-book-cover';

interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
  coverUrl?: string;
  genres?: string[];
  description?: string;
  publishedAt?: number;
}

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  // Cover handling
  const [coverMode, setCoverMode] = useState<'current' | 'file' | 'camera' | 'url'>('current');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');

  // Camera capture
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Genres handling
  const [existingGenres, setExistingGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);

  // Notification / Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookRes, genreRes] = await Promise.all([
          fetch(`/api/livros/${id}`),
          fetch('/api/genres')
        ]);

        if (!bookRes.ok) throw new Error('Livro não encontrado');
        const bookData = await bookRes.json();
        setBook(bookData);
        setPreviewCoverUrl(bookData.coverUrl || '');
        setUrlInput(bookData.coverUrl || '');

        if (genreRes.ok) {
          const genreData = await genreRes.json();
          setExistingGenres(genreData);
        }
      } catch (e) {
        console.error('Falha ao carregar dados:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Clean camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCapturingCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
      setIsCapturingCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewCoverUrl(dataUrl);

      // Convert dataUrl to File
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `cover_camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setSelectedFile(file);
        });

      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCapturingCamera(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreviewCoverUrl(urlInput.trim());
      setSelectedFile(null);
      if (book) {
        setBook({ ...book, coverUrl: urlInput.trim() });
      }
    }
  };

  // Add genre tag
  const addGenre = (genreToAdd: string) => {
    const trimmed = genreToAdd.trim();
    if (!trimmed || !book) return;
    const current = book.genres || [];
    if (!current.includes(trimmed)) {
      setBook({ ...book, genres: [...current, trimmed] });
    }
    setGenreInput('');
    setShowGenreSuggestions(false);
  };

  const removeGenre = (indexToRemove: number) => {
    if (!book) return;
    setBook({
      ...book,
      genres: (book.genres || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  // Translate Synopsis to Portuguese
  const handleTranslateSynopsis = async () => {
    if (!book || !book.description || translating) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: book.description })
      });
      if (!res.ok) throw new Error('Falha ao traduzir');
      const data = await res.json();
      if (data.translated) {
        setBook((prev) => prev ? ({ ...prev, description: data.translated }) : null);
        setNotification({ type: 'success', message: 'Sinopse traduzida para Português com sucesso!' });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error(e);
      setNotification({ type: 'error', message: 'Erro ao traduzir sinopse.' });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja EXCLUIR "${book?.title}"? Esta ação removerá o livro e seus registros associados.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/livros/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/livros');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao excluir livro.');
      }
    } catch (e) {
      alert('Erro ao excluir livro.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    setSaving(true);
    try {
      let finalCoverUrl = previewCoverUrl || book.coverUrl;

      // Upload file if new image was provided
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });

        if (!uploadRes.ok) throw new Error('Falha no upload da capa');
        const uploadJson = await uploadRes.json();
        finalCoverUrl = uploadJson.url;
      }

      const updatePayload = {
        ...book,
        coverUrl: finalCoverUrl
      };

      const res = await fetch('/api/livros/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Livro atualizado com sucesso!' });
        setTimeout(() => {
          router.push('/admin/livros');
          router.refresh();
        }, 1000);
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao atualizar livro');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao atualizar livro.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Carregando dados do livro...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <p className="text-base font-bold text-slate-800">Livro não encontrado</p>
        <p className="text-xs text-slate-500 mt-1 mb-4">O identificador informado não corresponde a nenhuma obra cadastrada.</p>
        <Link
          href="/admin/livros"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Voltar para o catálogo</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 flex flex-col gap-6">
      
      {/* ── NOTIFICATION TOAST ─────────────────────────────────── */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all border ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ── TOP HEADER & BREADCRUMB ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-neutral-800">
        <div>
          <Link
            href="/admin/livros"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Voltar para Gerenciar Livros</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Editar Livro
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              book.quantity > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}>
              {book.quantity > 0 ? `${book.quantity} em estoque` : 'Esgotado'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Atualize as informações, sinopse, capa física e inventário da obra.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href={`/livros/${book.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
            title="Abrir página no catálogo"
          >
            <ExternalLink size={14} />
            <span>Ver no Catálogo</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 rounded-xl text-xs font-bold border border-rose-200/60 dark:border-rose-800 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{deleting ? 'Excluindo...' : 'Excluir Livro'}</span>
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN STUDIO FORM ──────────────────────────────── */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: METADATA & INVENTORY (8 COLS) ───────── */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* CARD 1: Dados da Obra */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <span>Informações Principais</span>
            </h2>

            {/* Título */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Título do Livro *
              </label>
              <input
                type="text"
                required
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                placeholder="Ex: Dom Casmurro"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Autor ou Autores
              </label>
              <input
                type="text"
                value={book.author || ''}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                placeholder="Ex: Machado de Assis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Gêneros / Assuntos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Gêneros / Assuntos
              </label>
              
              {/* Tags Container */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 min-h-[44px]">
                {(book.genres || []).map((genre, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800"
                  >
                    <span>{genre}</span>
                    <button
                      type="button"
                      onClick={() => removeGenre(idx)}
                      className="hover:text-blue-900 dark:hover:text-white p-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onFocus={() => setShowGenreSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addGenre(genreInput);
                    }
                  }}
                  placeholder={(book.genres || []).length === 0 ? 'Ex: Ficção, Fantasia (Enter para adicionar)' : '+ Adicionar gênero'}
                  className="flex-1 min-w-[140px] px-2 py-1 text-xs bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Sugestões do Acervo */}
              {existingGenres.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                  <span className="font-semibold mr-1">Sugestões comuns:</span>
                  {existingGenres
                    .filter((g) => !(book.genres || []).includes(g))
                    .slice(0, 6)
                    .map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => addGenre(g)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        + {g}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Sinopse / Descrição com Botão de Tradução */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                  Sinopse / Descrição
                </label>
                {book.description && (
                  <button
                    type="button"
                    onClick={handleTranslateSynopsis}
                    disabled={translating}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {translating ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Traduzindo...</span>
                      </>
                    ) : (
                      <>
                        <Languages size={13} />
                        <span>Traduzir Sinopse p/ Português</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                rows={5}
                value={book.description || ''}
                onChange={(e) => setBook({ ...book, description: e.target.value })}
                placeholder="Breve resumo da obra para visualização dos estudantes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* CARD 2: Estoque e Ano de Publicação */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span>Estoque e Publicação</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantidade com Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Exemplares Físicos no Acervo
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBook({ ...book, quantity: Math.max(0, book.quantity - 1) })}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                  >
                    <Minus size={15} />
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={book.quantity}
                    onChange={(e) => setBook({ ...book, quantity: parseInt(e.target.value) || 0 })}
                    className="w-24 text-center px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-base font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setBook({ ...book, quantity: book.quantity + 1 })}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Total de cópias físicas disponíveis na estante escolar.</p>
              </div>

              {/* Ano */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Ano de Publicação
                </label>
                <input
                  type="number"
                  min={1500}
                  max={2030}
                  value={book.publishedAt || ''}
                  onChange={(e) => setBook({ ...book, publishedAt: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Ex: 1997"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: Gestão da Capa */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-600" />
              <span>Capa do Livro</span>
            </h2>

            {/* Abas de Origem da Capa */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-neutral-700 pb-3">
              <button
                type="button"
                onClick={() => {
                  setCoverMode('file');
                  stopCamera();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  coverMode === 'file'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                }`}
              >
                <Upload size={13} />
                <span>Arquivo Local</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCoverMode('camera');
                  startCamera();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  coverMode === 'camera'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                }`}
              >
                <Camera size={13} />
                <span>Tirar Foto (Webcam)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCoverMode('url');
                  stopCamera();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  coverMode === 'url'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                }`}
              >
                <Globe size={13} />
                <span>Link da Imagem</span>
              </button>
            </div>

            {/* Conteúdo da Aba Arquivo */}
            {coverMode === 'file' && (
              <div className="border-2 border-dashed border-slate-200 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="cover-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="cover-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="size-11 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-neutral-200">
                    Clique para selecionar uma foto da capa
                  </span>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG ou WEBP até 5MB
                  </span>
                </label>
              </div>
            )}

            {/* Conteúdo da Aba Câmera */}
            {coverMode === 'camera' && (
              <div className="flex flex-col items-center gap-3 bg-slate-950 p-4 rounded-2xl">
                <div className="relative w-full max-w-sm aspect-4/3 rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    <Camera size={14} />
                    <span>Fotografar Capa Física</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setCoverMode('current');
                    }}
                    className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba Link / URL */}
            {coverMode === 'url' && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/capa.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Aplicar URL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: LIVE 3D PREVIEW & ACTIONS (4 COLS) ─── */}
        <div className="lg:col-span-4 sticky top-6 flex flex-col gap-5">
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-6 shadow-xs flex flex-col items-center text-center">
            
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-4">
              Apresentação em Tempo Real
            </p>

            {/* 3D Modern Book Cover Live Showcase */}
            <div className="my-2 select-none">
              <ModernBookCover
                size="md"
                color="blue"
                coverImage={previewCoverUrl || book.coverUrl}
              >
                <BookHeader>
                  <BookOpen size={20} />
                </BookHeader>
                <BookTitle>{book.title || 'Título da Obra'}</BookTitle>
                <BookDescription>{book.author || 'Autor da Obra'}</BookDescription>
              </ModernBookCover>
            </div>

            {/* Resumo do Cartão */}
            <div className="mt-4 w-full">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                {book.title || 'Título do Livro'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 truncate">
                {book.author || 'Autor não informado'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  book.quantity > 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {book.quantity > 0 ? `${book.quantity} un. no estoque` : 'Esgotado'}
                </span>
                {book.publishedAt && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-neutral-700 dark:text-slate-300">
                    Ano: {book.publishedAt}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-neutral-700">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Salvando alterações...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>

              <Link
                href="/admin/livros"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 font-bold text-xs text-center transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
