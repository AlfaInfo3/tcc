'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft01Icon, 
  Delete02Icon, 
  FloppyDiskIcon, 
  Upload01Icon, 
  Camera01Icon, 
  Globe02Icon, 
  PlusSignIcon, 
  MinusSignIcon, 
  ArrowUpRight01Icon, 
  LoaderCircleIcon, 
  CheckmarkCircle02Icon, 
  Image01Icon, 
  BookOpen01Icon, 
  Tick01Icon, 
  Cancel01Icon, 
  TranslateIcon, 
  SparklesIcon 
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import { ModernBookCover, BookHeader, BookTitle, BookDescription } from '@/cuicui/other/books/modern-book-cover/modern-book-cover';

export interface BookData {
  id: string;
  title: string;
  author: string;
  quantity: number;
  coverUrl?: string;
  genres?: string[];
  description?: string;
  publishedAt?: number;
}

interface EditBookClientViewProps {
  id: string;
  initialBook: BookData;
  initialGenres: string[];
}

export function EditBookClientView({ id, initialBook, initialGenres }: EditBookClientViewProps) {
  const router = useRouter();

  const [book, setBook] = useState<BookData>(initialBook);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  // Cover handling
  const [coverMode, setCoverMode] = useState<'current' | 'file' | 'camera' | 'url'>('current');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState<string>(initialBook.coverUrl || '');
  const [urlInput, setUrlInput] = useState(initialBook.coverUrl || '');

  // Camera capture
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Genres handling
  const [existingGenres, setExistingGenres] = useState<string[]>(initialGenres);
  const [genreInput, setGenreInput] = useState('');
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);

  // Notification / Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      setBook({ ...book, coverUrl: urlInput.trim() });
    }
  };

  // Add genre tag
  const addGenre = (genreToAdd: string) => {
    const trimmed = genreToAdd.trim();
    if (!trimmed) return;
    const current = book.genres || [];
    if (!current.includes(trimmed)) {
      setBook({ ...book, genres: [...current, trimmed] });
    }
    setGenreInput('');
    setShowGenreSuggestions(false);
  };

  const removeGenre = (indexToRemove: number) => {
    setBook({
      ...book,
      genres: (book.genres || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  // Translate Synopsis to Portuguese
  const handleTranslateSynopsis = async () => {
    if (!book.description || translating) return;
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
        setBook((prev) => ({ ...prev, description: data.translated }));
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
    if (!confirm(`Tem certeza que deseja EXCLUIR "${book.title}"? Esta ação removerá o livro e seus registros associados.`)) {
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

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 flex flex-col gap-6">
      
      {/* ── NOTIFICATION TOAST ─────────────────────────────────── */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-md animate-in fade-in duration-200 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
        }`}>
          <HugeIcon icon={CheckmarkCircle02Icon} size={18} className="shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{notification.message}</p>
        </div>
      )}

      {/* ── TOP HEADER & BREADCRUMB ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/livros"
            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
            title="Voltar para a lista de livros"
          >
            <HugeIcon icon={ArrowLeft01Icon} size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-neutral-500">
              <Link href="/admin/livros" className="hover:underline">Acervo</Link>
              <span>/</span>
              <span className="text-slate-700 dark:text-neutral-300 truncate max-w-[200px]">{book.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Editar Obra
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href={`/livros/${book.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
          >
            <HugeIcon icon={ArrowUpRight01Icon} size={14} />
            <span>Ver no Catálogo</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
            title="Excluir este livro permanentemente"
          >
            <HugeIcon icon={Delete02Icon} size={14} />
            <span>{deleting ? 'Excluindo...' : 'Excluir'}</span>
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN STUDIO FORM ──────────────────────────────── */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: METADATA & INVENTORY (8 COLS) ───────── */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Metadata Card */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <HugeIcon icon={BookOpen01Icon} size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Informações Principais</span>
            </h2>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                Título da Obra <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ex: O Pequeno Príncipe"
              />
            </div>

            {/* Author Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                  Autor(a) / Organizador
                </label>
                <input
                  type="text"
                  value={book.author}
                  onChange={(e) => setBook({ ...book, author: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Antoine de Saint-Exupéry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                  Ano de Publicação
                </label>
                <input
                  type="number"
                  min="1500"
                  max="2099"
                  value={book.publishedAt || ''}
                  onChange={(e) => setBook({ ...book, publishedAt: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ex: 1943"
                />
              </div>
            </div>

            {/* Inventory Quantity Stepper */}
            <div className="pt-2 border-t border-slate-100 dark:border-neutral-700/60">
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
                Quantidade em Estoque Físico
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-neutral-900 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setBook({ ...book, quantity: Math.max(0, book.quantity - 1) })}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <HugeIcon icon={MinusSignIcon} size={14} />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={book.quantity}
                    onChange={(e) => setBook({ ...book, quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-16 text-center text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setBook({ ...book, quantity: book.quantity + 1 })}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <HugeIcon icon={PlusSignIcon} size={14} />
                  </button>
                </div>
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  {book.quantity === 1 ? '1 exemplar físico' : `${book.quantity} exemplares físicos`}
                </span>
              </div>
            </div>

          </div>

          {/* Genres / Tags Card */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
              Gêneros e Categorias
            </h2>

            {/* Current Active Badges */}
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {book.genres && book.genres.length > 0 ? (
                book.genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
                  >
                    <span>{g}</span>
                    <button
                      type="button"
                      onClick={() => removeGenre(idx)}
                      className="hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <HugeIcon icon={Cancel01Icon} size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Nenhum gênero cadastrado.</p>
              )}
            </div>

            {/* Add Genre Input + Auto Suggestion */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => {
                    setGenreInput(e.target.value);
                    setShowGenreSuggestions(true);
                  }}
                  onFocus={() => setShowGenreSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGenre(genreInput);
                    }
                  }}
                  placeholder="Digitar gênero e pressionar Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addGenre(genreInput)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-slate-700 dark:text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Adicionar
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showGenreSuggestions && existingGenres.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-lg p-1.5 flex flex-wrap gap-1">
                  {existingGenres
                    .filter((eg) => eg.toLowerCase().includes(genreInput.toLowerCase()) && !(book.genres || []).includes(eg))
                    .slice(0, 15)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addGenre(suggestion)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-neutral-700 dark:hover:bg-blue-900/60 text-slate-700 dark:text-neutral-200 text-left transition-colors cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Synopsis / Description Card with Translate Feature */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <span>Sinopse & Apresentação</span>
              </h2>

              {book.description && (
                <button
                  type="button"
                  onClick={handleTranslateSynopsis}
                  disabled={translating}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                  title="Traduzir sinopse para Português usando IA"
                >
                  {translating ? (
                    <>
                      <HugeIcon icon={LoaderCircleIcon} size={12} className="animate-spin text-amber-600" />
                      <span>Traduzindo...</span>
                    </>
                  ) : (
                    <>
                      <HugeIcon icon={TranslateIcon} size={12} />
                      <span>Traduzir p/ Português</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              rows={6}
              value={book.description || ''}
              onChange={(e) => setBook({ ...book, description: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-y"
              placeholder="Digite a sinopse detalhada ou apresentação do livro..."
            />
          </div>

          {/* Cover Management Studio (File Upload, Camera, or Web URL) */}
          <div className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-slate-200/90 dark:border-neutral-700/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <HugeIcon icon={Image01Icon} size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Gerenciamento da Imagem da Capa</span>
            </h2>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-neutral-900">
              <button
                type="button"
                onClick={() => setCoverMode('file')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  coverMode === 'file' 
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                }`}
              >
                <HugeIcon icon={Upload01Icon} size={14} />
                <span>Upload Arquivo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCoverMode('camera');
                  startCamera();
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  coverMode === 'camera' 
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                }`}
              >
                <HugeIcon icon={Camera01Icon} size={14} />
                <span>Câmera / Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setCoverMode('url')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  coverMode === 'url' 
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                }`}
              >
                <HugeIcon icon={Globe02Icon} size={14} />
                <span>Link / URL Externa</span>
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {coverMode === 'file' && (
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-neutral-700 text-center space-y-2">
                <input
                  type="file"
                  id="coverFileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverFileInput"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <HugeIcon icon={Upload01Icon} size={14} />
                  <span>Escolher imagem do dispositivo</span>
                </label>
                {selectedFile && (
                  <p className="text-xs text-emerald-600 font-bold">
                    ✓ Arquivo selecionado: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Mode 2: Camera Capture */}
            {coverMode === 'camera' && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 flex flex-col items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm rounded-xl aspect-[3/4] object-cover bg-black"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    Capturar Foto da Capa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setCoverMode('current');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
                  >
                    Fechar Câmera
                  </button>
                </div>
              </div>
            )}

            {/* Mode 3: URL Direct Link */}
            {coverMode === 'url' && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/capa.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
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
                  <HugeIcon icon={BookOpen01Icon} size={20} />
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
                    <HugeIcon icon={LoaderCircleIcon} size={16} className="animate-spin" />
                    <span>Salvando alterações...</span>
                  </>
                ) : (
                  <>
                    <HugeIcon icon={FloppyDiskIcon} size={16} />
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
