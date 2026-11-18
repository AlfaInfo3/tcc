'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  BarcodeScanIcon, 
  Camera01Icon, 
  Tick01Icon, 
  Cancel01Icon, 
  LoaderCircleIcon, 
  SparklesIcon, 
  Upload01Icon, 
  PlusSignIcon, 
  MinusSignIcon, 
  CheckmarkCircle02Icon, 
  Alert02Icon,
  ReloadIcon,
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import { Modal } from '@/components/ui/modal';
import { Html5Qrcode } from 'html5-qrcode';
import { BookSearchResult } from '@/lib/book-search';

interface QuickBookRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCreated?: () => void;
}

export function QuickBookRegisterModal({ isOpen, onClose, onBookCreated }: QuickBookRegisterModalProps) {
  // Input State
  const [isbnInput, setIsbnInput] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Book Data State
  const [bookData, setBookData] = useState<BookSearchResult | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customCover, setCustomCover] = useState<string | null>(null);
  const [isCoverApproved, setIsCoverApproved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Barcode Scanner Camera State
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'quick-barcode-scanner-viewport';

  // Photo Capture Camera State
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const isbnInputRef = useRef<HTMLInputElement | null>(null);
  const focusTimeoutRef = useRef<number | null>(null);
  const scannerTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Auto focus on input when opened
  useEffect(() => {
    if (isOpen) {
      focusTimeoutRef.current = window.setTimeout(() => {
        isbnInputRef.current?.focus();
      }, 150);
    } else {
      stopScanner();
      stopPhotoCamera();
      resetForm();
    }

    return () => {
      if (focusTimeoutRef.current !== null) window.clearTimeout(focusTimeoutRef.current);
    };
  }, [isOpen]);

  // Safety net: never leave the camera or pending timers running after unmount.
  useEffect(() => {
    return () => {
      if (scannerTimeoutRef.current !== null) window.clearTimeout(scannerTimeoutRef.current);
      if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
      if (focusTimeoutRef.current !== null) window.clearTimeout(focusTimeoutRef.current);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      const scanner = scannerRef.current;
      if (scanner) {
        scannerRef.current = null;
        scanner.stop().then(() => scanner.clear()).catch(() => undefined);
      }
    };
  }, []);

  const resetForm = () => {
    setIsbnInput('');
    setBookData(null);
    setCustomCover(null);
    setIsCoverApproved(true);
    setQuantity(1);
    setSearchError(null);
    setSuccessMessage(null);
  };

  // ── SEARCH BY ISBN ───────────────────────────────────────────
  const handleSearchBook = useCallback(async (code: string) => {
    const clean = code.replace(/[^0-9Xx]/g, '').trim();
    if (!clean) return;

    setLoadingSearch(true);
    setSearchError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/livros/search?isbn=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const results: BookSearchResult[] = await res.json();
        if (results && results.length > 0) {
          const found = results[0];
          setBookData(found);
          setCustomCover(null);
          setIsCoverApproved(true);
          // Play subtle sound or haptic feedback if available
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(100);
          }
        } else {
          setSearchError('Nenhum livro localizado para este ISBN/código nas bases nacionais e internacionais.');
          setBookData(null);
        }
      } else {
        setSearchError('Erro ao consultar bases de dados de livros.');
      }
    } catch (err) {
      console.error(err);
      setSearchError('Falha de conexão com os serviços de catálogo.');
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // ── BARCODE SCANNER VIA WEBCAM / MOBILE ───────────────────────
  const startScanner = async () => {
    setIsScanning(true);
    setSearchError(null);

    // Wait for DOM to render the container
    scannerTimeoutRef.current = window.setTimeout(async () => {
      try {
        if (!scannerDivId || !document.getElementById(scannerDivId)) {
          setIsScanning(false);
          return;
        }

        const html5QrCode = new Html5Qrcode(scannerDivId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.77,
          },
          async (decodedText) => {
            // Success barcode callback
            stopScanner();
            setIsbnInput(decodedText);
            await handleSearchBook(decodedText);
          },
          () => {
            // Frame scan without barcode (silent)
          }
        );
      } catch (err) {
        console.error('Failed to start barcode scanner:', err);
        setSearchError('Não foi possível acessar a câmera para escanear código de barras. Verifique as permissões.');
        setIsScanning(false);
      }
    }, 200);
  };

  const stopScanner = () => {
    if (scannerTimeoutRef.current !== null) {
      window.clearTimeout(scannerTimeoutRef.current);
      scannerTimeoutRef.current = null;
    }

    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      scanner.stop().then(() => {
        scanner.clear();
      }).catch(() => undefined);
    }
    setIsScanning(false);
  };

  // ── PHOTO CAPTURE FOR PHYSICAL COVERS ─────────────────────────
  const startPhotoCamera = async () => {
    setIsCapturingPhoto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error opening camera for photo:', err);
      setSearchError('Não foi possível acessar a câmera. Você também pode enviar uma imagem do seu computador.');
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
      setCustomCover(dataUrl);
      setIsCoverApproved(true);
    }
    stopPhotoCamera();
  };

  const stopPhotoCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCapturingPhoto(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomCover(event.target.result as string);
          setIsCoverApproved(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ── SAVE BOOK TO DATABASE ────────────────────────────────────
  const handleSaveBook = async (keepOpenForNext = false) => {
    if (!bookData || !bookData.title) return;

    setSaving(true);
    try {
      const finalCover = customCover || bookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80';
      const author = bookData.authors.join(', ') || 'Autor Desconhecido';

      const response = await fetch('/api/livros/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookData.title,
          author,
          coverUrl: finalCover,
          description: bookData.description || `Publicado em ${bookData.publishedYear || '?'}`,
          publishedAt: bookData.publishedYear || undefined,
          quantity: Math.max(1, quantity),
          genres: bookData.genres || ['Geral'],
        }),
      });

      if (response.ok) {
        setSuccessMessage(`"${bookData.title}" cadastrado com sucesso!`);
        if (onBookCreated) onBookCreated();

        if (keepOpenForNext) {
          // Prepare immediately for next book
          setBookData(null);
          setIsbnInput('');
          setCustomCover(null);
          setIsCoverApproved(true);
          setQuantity(1);
          focusTimeoutRef.current = window.setTimeout(() => {
            isbnInputRef.current?.focus();
          }, 100);
        } else {
          closeTimeoutRef.current = window.setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        const errorData = await response.json();
        setSearchError(`Erro ao cadastrar livro: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error(err);
      setSearchError('Falha de conexão ao salvar livro.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="quick-book-modal-title"
      className="max-w-2xl border-slate-100 bg-white font-quicksand"
    >
        {/* ── HEADER ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-600/90 flex items-center justify-center text-white shadow-md">
              <HugeIcon icon={SparklesIcon} size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 id="quick-book-modal-title" className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Cadastro Rápido de Livros
              </h2>
              <p className="text-[11px] text-blue-200 font-medium">
                Escaneie o código ou digite o ISBN para catalogar em segundos com metadados em PT-BR
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fechar"
          >
            <HugeIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* ── BODY ───────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in-0">
              <HugeIcon icon={CheckmarkCircle02Icon} size={18} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {searchError && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-in fade-in-0">
              <HugeIcon icon={Alert02Icon} size={18} className="text-rose-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* ── STEP 1: INPUT OU SCANNER DE CÓDIGO DE BARRAS ─── */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Código de Barras / ISBN
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={isbnInputRef}
                  type="text"
                  placeholder="Digite ou leia o código (ex: 9788535914849)..."
                  value={isbnInput}
                  onChange={(e) => {
                    setIsbnInput(e.target.value);
                    const clean = e.target.value.replace(/[^0-9Xx]/g, '');
                    if (clean.length === 10 || clean.length === 13) {
                      handleSearchBook(clean);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchBook(isbnInput);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                {loadingSearch && (
                  <div className="absolute right-3 top-3">
                    <HugeIcon icon={LoaderCircleIcon} size={18} className="animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSearchBook(isbnInput)}
                disabled={loadingSearch || !isbnInput.trim()}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                Buscar
              </button>

              <button
                type="button"
                onClick={() => (isScanning ? stopScanner() : startScanner())}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isScanning 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                }`}
              >
                <HugeIcon icon={Camera01Icon} size={16} />
                <span>{isScanning ? 'Parar Câmera' : 'Escanear Câmera'}</span>
              </button>
            </div>

            {/* Live Camera Barcode Viewport */}
            {isScanning && (
              <div className="mt-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 animate-in fade-in-0">
                <div className="flex items-center justify-between mb-2 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                    <HugeIcon icon={BarcodeScanIcon} size={16} />
                    <span>Aponte o código de barras para a linha vermelha</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={stopScanner}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Fechar Câmera
                  </button>
                </div>
                <div 
                  id={scannerDivId} 
                  className="w-full rounded-xl overflow-hidden bg-black max-h-[220px]"
                />
              </div>
            )}
          </div>

          {/* ── STEP 2: PREVIEW DO LIVRO LOCALIZADO ───────────── */}
          {bookData && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 animate-in fade-in-50 duration-200">
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                {/* Book Cover Box */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative w-28 h-40 rounded-xl overflow-hidden shadow-md bg-slate-200 border border-slate-300">
                    <Image
                      src={customCover || bookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80'}
                      alt={`Capa de ${bookData.title}`}
                      fill
                      sizes="112px"
                      unoptimized
                      className="object-cover"
                    />
                    {isCoverApproved && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <HugeIcon icon={Tick01Icon} size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Cover Action Buttons */}
                  <div className="mt-2.5 flex flex-col gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => setIsCoverApproved(!isCoverApproved)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-xl transition-all border ${
                        isCoverApproved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isCoverApproved ? (
                        <span className="inline-flex items-center gap-1">
                          <HugeIcon icon={Tick01Icon} size={12} />
                          <span>Capa Aprovada</span>
                        </span>
                      ) : (
                        'Aprovar Capa'
                      )}
                    </button>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={startPhotoCamera}
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all cursor-pointer"
                        title="Tirar foto da capa física com a câmera"
                      >
                        <HugeIcon icon={Camera01Icon} size={12} />
                        <span>Foto</span>
                      </button>

                      <label className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all cursor-pointer">
                        <HugeIcon icon={Upload01Icon} size={12} />
                        <span>Upload</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Details Form Box */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Título da Obra
                    </label>
                    <input
                      type="text"
                      value={bookData.title}
                      onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Autor(es)
                      </label>
                      <input
                        type="text"
                        value={bookData.authors.join(', ')}
                        onChange={(e) => setBookData({ ...bookData, authors: [e.target.value] })}
                        className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Ano de Publicação
                      </label>
                      <input
                        type="number"
                        value={bookData.publishedYear || ''}
                        onChange={(e) => setBookData({ ...bookData, publishedYear: parseInt(e.target.value) || undefined })}
                        className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                        placeholder="Ex: 2024"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Sinopse (Em Português)
                      </label>
                      {bookData.source && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Origem: {bookData.source.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={bookData.description || ''}
                      onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                      placeholder="Sinopse do livro..."
                      className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                    />
                  </div>

                  {/* Quantity and Tags */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700">Quantidade de Cópias:</span>
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <HugeIcon icon={MinusSignIcon} size={14} />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-900 min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <HugeIcon icon={PlusSignIcon} size={14} />
                        </button>
                      </div>
                    </div>

                    {bookData.genres && bookData.genres.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-end">
                        {bookData.genres.slice(0, 2).map((g, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PHOTO CAPTURE MODAL OVERLAY ──────────────────── */}
          {isCapturingPhoto && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <HugeIcon icon={Camera01Icon} size={16} />
                  <span>Posicione a capa do livro na câmera e clique em Fotografar</span>
                </span>
                <button
                  type="button"
                  onClick={stopPhotoCamera}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <HugeIcon icon={Cancel01Icon} size={16} />
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black max-h-[300px] flex items-center justify-center">
                <video ref={videoRef} className="w-full h-auto object-contain" autoPlay playsInline muted />
              </div>

              <div className="mt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <HugeIcon icon={Camera01Icon} size={16} />
                  <span>Fotografar Capa</span>
                </button>
                <button
                  type="button"
                  onClick={stopPhotoCamera}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ─────────────────────────────────── */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Limpar
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Cancelar
            </button>

            {bookData && (
              <>
                <button
                  type="button"
                  onClick={() => handleSaveBook(true)}
                  disabled={saving}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Salva este livro no banco e já prepara o leitor para o próximo código de barras"
                >
                  {saving ? <HugeIcon icon={LoaderCircleIcon} size={14} className="animate-spin" /> : <HugeIcon icon={ReloadIcon} size={14} />}
                  <span>Salvar e Próximo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBook(false)}
                  disabled={saving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <HugeIcon icon={LoaderCircleIcon} size={14} className="animate-spin" /> : <HugeIcon icon={Tick01Icon} size={14} strokeWidth={3} />}
                  <span>Salvar e Concluir</span>
                </button>
              </>
            )}
          </div>
        </div>
    </Modal>
  );
}
