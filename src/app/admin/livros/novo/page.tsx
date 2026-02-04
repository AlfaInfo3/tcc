'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BookSuggestion {
  title: string;
  authors: string[];
  isbn: string;
  publishedYear?: number;
  coverUrl?: string;
}

export default function NewBookPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: '',
    quantity: 1,
    coverUrl: '',
    genres: [] as string[],
    description: ''
  });

  // Tag Input State
  const [currentGenreInput, setCurrentGenreInput] = useState('');
  const [existingGenres, setExistingGenres] = useState<string[]>([]);
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => setExistingGenres(data))
      .catch(err => console.error("Failed to load genres", err));
  }, []);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Search/Autocomplete State
  interface ExtendedBookSuggestion extends BookSuggestion {
    workKey?: string;
    genres?: string[];
  }
  const [suggestions, setSuggestions] = useState<ExtendedBookSuggestion[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false); // To show spinner when fetching details
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.title.length >= 3 && showSuggestions) {
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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.title, showSuggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelectBook = async (book: ExtendedBookSuggestion) => {
    // 1. Set basic info immediately
    setFormData(prev => ({
      ...prev,
      title: book.title,
      author: book.authors.join(', '),
      isbn: book.isbn,
      publishedYear: book.publishedYear?.toString() || '',
      coverUrl: book.coverUrl || '',
      genres: book.genres || [], 
    }));
    setShowSuggestions(false);

    // 2. Fetch full details (description + maybe better genre)
    if (book.workKey) {
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/livros/details?key=${book.workKey}`);
            if (res.ok) {
                const details = await res.json();
                setFormData(prev => ({
                    ...prev,
                    description: details.description || prev.description,
                    genres: details.genres && details.genres.length > 0 
                            ? Array.from(new Set([...prev.genres, ...details.genres])) // Merge unique
                            : prev.genres
                }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingDetails(false);
        }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
        alert('Título e Autor são obrigatórios');
        return;
    }

    try {
      let finalCoverUrl = formData.coverUrl;

      // Handle Image Upload if file exists
      if (coverFile) {
          const uploadData = new FormData();
          uploadData.append('file', coverFile);
          
          const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: uploadData
          });
          
          if (uploadRes.ok) {
              const { url } = await uploadRes.json();
              finalCoverUrl = url;
          } else {
              alert('Erro ao fazer upload da imagem. O livro será salvo sem a capa personalizada.');
          }
      }

      const response = await fetch('/api/livros/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          coverUrl: finalCoverUrl,
          publishedYear: parseInt(formData.publishedYear) || undefined,
          quantity: parseInt(formData.quantity.toString()),
          description: formData.description || `Publicado em ${formData.publishedYear || '?'}`,
          genres: formData.genres
        }),
      });

      if (response.ok) {
        router.push('/admin/livros');
        router.refresh();
      } else {
        alert('Erro ao salvar o livro');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Erro ao salvar o livro');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Adicionar Livro</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        
        {/* Title / Search Input */}
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Livro</label>
            <div className="relative">
                <input
                type="text"
                placeholder="Digite o título para buscar automático..."
                value={formData.title}
                onChange={(e) => {
                    setFormData({...formData, title: e.target.value});
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full p-2 pr-8 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                autoComplete="off"
                />
                {/* Spinner inside input */}
                {(loadingSearch || loadingDetails) && (
                    <div className="absolute right-2 top-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((book, index) => (
                  <li 
                    key={`${book.isbn}-${index}`}
                    onClick={() => handleSelectBook(book)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  >
                    {book.coverUrl && (
                      <div className="w-8 h-12 relative shrink-0">
                        <Image src={book.coverUrl} alt={book.title} fill className="object-cover rounded" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.authors.join(', ')}</p>
                      {book.genres && book.genres.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-0.5">
                              {book.genres.slice(0, 3).map((g, i) => (
                                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">{g}</span>
                              ))}
                          </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* Other Fields - Auto-filled but editable */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor(es)</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gêneros / Assunto</label>
                <div className="relative flex flex-wrap gap-2 p-2 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-indigo-500 bg-white min-h-[42px]">
                    {formData.genres.map((g, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                            {g}
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, genres: formData.genres.filter((_, i) => i !== idx)})}
                                className="hover:text-indigo-900 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <div className="relative flex-1 min-w-[100px]">
                        <input
                            type="text"
                            placeholder={formData.genres.length === 0 ? "Ex: Fantasia (Enter para adicionar)" : ""}
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
                                        setFormData(prev => ({
                                            ...prev, 
                                            genres: [...prev.genres, currentGenreInput.trim()]
                                        }));
                                        setCurrentGenreInput('');
                                        setShowGenreSuggestions(false);
                                    }
                                }
                            }}
                            onBlur={() => {
                                // Delay to allow click on suggestion
                                setTimeout(() => {
                                     setShowGenreSuggestions(false);
                                     if (currentGenreInput.trim()) {
                                         setFormData(prev => ({
                                            ...prev, 
                                            genres: [...prev.genres, currentGenreInput.trim()]
                                        }));
                                        setCurrentGenreInput('');
                                    }
                                }, 200);
                            }}
                            className="w-full h-full outline-none text-sm bg-transparent"
                        />
                         {/* Genre Suggestions Dropdown */}
                        {showGenreSuggestions && currentGenreInput.length > 0 && (
                            <ul className="absolute left-0 bottom-full mb-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto z-10">
                                {existingGenres
                                    .filter(g => g.toLowerCase().includes(currentGenreInput.toLowerCase()) && !formData.genres.includes(g))
                                    .map((g, i) => (
                                    <li 
                                        key={i}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent blur
                                            setFormData(prev => ({
                                                ...prev, 
                                                genres: [...prev.genres, g]
                                            }));
                                            setCurrentGenreInput('');
                                            setShowGenreSuggestions(false);
                                        }}
                                        className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                                    >
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Pressione Enter ou Vírgula para adicionar tags.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Publicação</label>
                <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) => setFormData({...formData, publishedYear: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sinopse / Descrição</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Sinopse do livro..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
        </div>

        {/* Cover Preview (from API) */}
        {formData.coverUrl && !coverFile && (
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded border border-blue-100">
                <div className="h-20 w-14 relative shrink-0 border rounded overflow-hidden">
                    <Image src={formData.coverUrl} alt="Capa" fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Capa importada automaticamente</p>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, coverUrl: ''})}
                        className="text-xs text-red-500 hover:underline mt-1"
                    >
                        Remover capa
                    </button>
                </div>
            </div>
        )}

        {/* Manual File Upload */}
        <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Capa Manual (Opcional)</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCoverFile(file);
                    // Clear API URL if user selects a file manually to avoid confusion
                    if (file) setFormData({...formData, coverUrl: ''});
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
            />
            {coverFile && (
                <p className="text-sm text-green-600 mt-2">
                    Arquivo selecionado: {coverFile.name}
                </p>
            )}
        </div>

        <div className="pt-4">
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium transition-colors"
                disabled={!formData.title}
            >
                Adicionar ao Estoque
            </button>
        </div>

      </form>
    </div>
  );
}
