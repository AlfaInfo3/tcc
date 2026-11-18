'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatDateBR } from '@/lib/format';

function previewDueDate(days: number) {
  return formatDateBR(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
}

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

type Feedback = { type: 'error'; message: string } | null;

export default function NewLoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

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
    if (!newStudent.name || !newStudent.class) {
      setFeedback({ type: 'error', message: 'Preencha nome e turma para o cadastro rápido.' });
      return;
    }

    setRegistering(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/alunos/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (res.ok) {
        const student = await res.json();
        setSelectedStudent(student);
        setShowFastRegister(false);
        setStudentResults([]);
        setStudentQuery('');
        setNewStudent({ name: '', class: '' });
        return;
      }

      const err = await res.json().catch(() => ({}));
      setFeedback({ type: 'error', message: err.error || 'Erro ao cadastrar aluno.' });
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
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
        // Query the local catalog instead of OpenLibrary.
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
    setFeedback(null);

    try {
      const res = await fetch('/api/emprestimos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          bookId: selectedBook.id,
          days,
          type: 'local', // Presencial
        }),
      });

      if (res.ok) {
        router.push('/admin/emprestimos');
        router.refresh();
        return;
      }

      const err = await res.json().catch(() => ({}));
      setFeedback({ type: 'error', message: err.error || 'Erro ao criar empréstimo.' });
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link
        href="/admin/emprestimos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para empréstimos
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Novo empréstimo (presencial)</h1>
        <p className="text-muted-foreground mt-1">Selecione o aluno e o livro para registrar a retirada.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        {/* Student Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-foreground">Buscar aluno</label>
            {!selectedStudent && !showFastRegister && (
              <button
                type="button"
                onClick={() => setShowFastRegister(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                + Cadastrar novo
              </button>
            )}
          </div>

          {selectedStudent ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="min-w-0">
                <p className="font-semibold text-blue-900 dark:text-blue-200 break-words">{selectedStudent.name}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{selectedStudent.class}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudent(null);
                  setStudentQuery('');
                }}
                className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
              >
                Trocar
              </button>
            </div>
          ) : showFastRegister ? (
            <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-sm font-bold text-foreground">Cadastro rápido</p>
              <input
                className={inputClass}
                placeholder="Nome completo"
                value={newStudent.name}
                onChange={(event) => setNewStudent({ ...newStudent, name: event.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Turma (ex: 1º A)"
                value={newStudent.class}
                onChange={(event) => setNewStudent({ ...newStudent, class: event.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFastRegister(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleFastRegister}
                  disabled={registering}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {registering ? 'Salvando...' : 'Salvar e usar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Nome do aluno..."
                value={studentQuery}
                onChange={(event) => setStudentQuery(event.target.value)}
                className={inputClass}
              />
              {studentResults.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                  {studentResults.map((student) => (
                    <li key={student.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="w-full border-b border-border px-3 py-2 text-left text-sm text-foreground last:border-0 hover:bg-muted"
                      >
                        {student.name} - <span className="text-muted-foreground">{student.class}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {studentQuery.length >= 2 && studentResults.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover p-3 text-center text-sm text-muted-foreground shadow-lg">
                  Nenhum aluno encontrado.
                  <button
                    type="button"
                    onClick={() => setShowFastRegister(true)}
                    className="ml-1 text-primary hover:underline"
                  >
                    Cadastrar?
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Book Selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Buscar livro</label>
          {selectedBook ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <div className="min-w-0">
                <p className="font-semibold text-green-900 dark:text-green-200 break-words">{selectedBook.title}</p>
                <p className="text-sm text-green-700 dark:text-green-300">{selectedBook.author}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBook(null);
                  setBookQuery('');
                }}
                className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
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
                onChange={(event) => setBookQuery(event.target.value)}
                className={inputClass}
              />
              {bookResults.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                  {bookResults.map((book) => (
                    <li key={book.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="w-full border-b border-border px-3 py-2 text-left text-sm text-foreground last:border-0 hover:bg-muted"
                      >
                        {book.title}{' '}
                        <span className="text-xs text-muted-foreground">({book.quantity} disp.)</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="days" className="mb-1.5 block text-sm font-medium text-foreground">
            Prazo (dias)
          </label>
          <input
            id="days"
            type="number"
            value={days}
            onChange={(event) => setDays(parseInt(event.target.value, 10))}
            min="1"
            className={inputClass}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Data de devolução prevista: {previewDueDate(days)}
          </p>
        </div>

        {feedback && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {feedback.message}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedStudent || !selectedBook || loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Processando...' : 'Confirmar empréstimo'}
        </button>
      </div>
    </div>
  );
}
