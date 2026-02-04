'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  class: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
}

export default function NewLoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Search States
  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [bookQuery, setBookQuery] = useState('');
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Form
  const [days, setDays] = useState(14); // Default 2 weeks

  // Fast Register State
  const [showFastRegister, setShowFastRegister] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', class: '' });
  const [registering, setRegistering] = useState(false);

  const handleFastRegister = async () => {
      if (!newStudent.name || !newStudent.class) return alert('Preencha nome e turma');
      setRegistering(true);
      try {
           const res = await fetch('/api/alunos/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent)
            });
            if (res.ok) {
                const student = await res.json();
                setSelectedStudent(student);
                setShowFastRegister(false);
                setStudentResults([]); 
                setStudentQuery('');
                setNewStudent({ name: '', class: '' });
            } else {
                const err = await res.json();
                alert(err.error || 'Erro ao cadastrar');
            }
      } catch (e) {
          alert('Erro de conexão');
      } finally {
          setRegistering(false);
      }
  };

  // Search Students
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (studentQuery.length >= 2 && !selectedStudent) {
        const res = await fetch(`/api/alunos/search?q=${encodeURIComponent(studentQuery)}`);
        if (res.ok) {
            const data = await res.json();
            setStudentResults(data);
        }
      } else {
        setStudentResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [studentQuery, selectedStudent]);

  // Search Books
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (bookQuery.length >= 2 && !selectedBook) {
        // Changed to search-local to query DB instead of OpenLibrary
        const res = await fetch(`/api/livros/search-local?q=${encodeURIComponent(bookQuery)}`);
        if (res.ok) setBookResults(await res.json());
      } else {
        setBookResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [bookQuery, selectedBook]);

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedBook) return;

    setLoading(true);
    try {
        const res = await fetch('/api/emprestimos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: selectedStudent.id,
                bookId: selectedBook.id,
                days: days,
                type: 'local' // Presencial
            })
        });

        if (res.ok) {
            router.push('/admin/emprestimos');
            router.refresh();
        } else {
            const err = await res.json();
            alert(err.error || 'Erro ao criar empréstimo');
        }
    } catch (e) {
        alert('Erro de conexão');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Novo Empréstimo (Presencial)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        
        {/* Student Selector */}
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Buscar Aluno</label>
                {!selectedStudent && !showFastRegister && (
                    <button 
                        onClick={() => setShowFastRegister(true)}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        + Cadastrar Novo
                    </button>
                )}
            </div>
            
            {selectedStudent ? (
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
                    <div>
                        <p className="font-semibold text-blue-900">{selectedStudent.name}</p>
                        <p className="text-sm text-blue-700">{selectedStudent.class}</p>
                    </div>
                    <button 
                        onClick={() => { setSelectedStudent(null); setStudentQuery(''); }}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                        Trocar
                    </button>
                </div>
            ) : showFastRegister ? (
                <div className="p-3 bg-gray-50 border rounded space-y-3">
                    <p className="text-sm font-bold text-gray-700">Cadastro Rápido</p>
                    <input 
                        className="w-full p-2 border rounded" 
                        placeholder="Nome Completo"
                        value={newStudent.name}
                        onChange={e => setNewStudent({...newStudent, name: e.target.value})}    
                    />
                    <input 
                        className="w-full p-2 border rounded" 
                        placeholder="Turma (Ex: 1º A)"
                        value={newStudent.class}
                        onChange={e => setNewStudent({...newStudent, class: e.target.value})}    
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowFastRegister(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
                        <button 
                            onClick={handleFastRegister} 
                            disabled={registering}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {registering ? '...' : 'Salvar e Usar'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Nome do aluno..."
                        value={studentQuery}
                        onChange={(e) => setStudentQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    {studentResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 shadow-lg max-h-48 overflow-y-auto">
                            {studentResults.map(s => (
                                <li 
                                    key={s.id} 
                                    onClick={() => setSelectedStudent(s)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                >
                                    {s.name} - <span className="text-gray-500">{s.class}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                     {studentQuery.length >= 2 && studentResults.length === 0 && (
                          <div className="absolute z-10 w-full bg-white border mt-1 shadow-lg p-3 text-center text-sm text-gray-500">
                              Nenhum aluno encontrado. 
                              <button onClick={() => setShowFastRegister(true)} className="text-blue-600 ml-1 hover:underline">Cadastrar?</button>
                          </div>
                     )}
                </div>
            )}
        </div>

        {/* Book Selector */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Livro</label>
            {selectedBook ? (
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                    <div>
                        <p className="font-semibold text-green-900">{selectedBook.title}</p>
                        <p className="text-sm text-green-700">{selectedBook.author}</p>
                    </div>
                    <button 
                        onClick={() => { setSelectedBook(null); setBookQuery(''); }}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                        Trocar
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Título do livro..."
                        value={bookQuery}
                        onChange={(e) => setBookQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                     {bookResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 shadow-lg max-h-48 overflow-y-auto">
                            {bookResults.map(b => (
                                <li 
                                    key={b.id} 
                                    onClick={() => setSelectedBook(b)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                >
                                    {b.title} <span className="text-xs text-gray-500">({b.quantity} disp.)</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>

        {/* Duration */}
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (Dias)</label>
            <input 
                type="number" 
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                min="1"
                className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
                Data de devolução prevista: {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
        </div>

        <button 
            onClick={handleSubmit}
            disabled={!selectedStudent || !selectedBook || loading}
            className={`w-full py-2 rounded text-white font-medium ${
                !selectedStudent || !selectedBook 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            {loading ? 'Processando...' : 'Confirmar Empréstimo'}
        </button>

      </div>
    </div>
  );
}
