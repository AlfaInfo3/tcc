'use client';

import { useState } from 'react';
import { Loan } from '@/types/emprestimo';

interface LoanFormProps {
  onSubmit: (loanData: Omit<Loan, 'id' | 'status' | 'loanDate' | 'dueDate' | 'createdAt'>) => void;
}

export function LoanForm({ onSubmit }: LoanFormProps) {
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    loanType: 'local' as 'local' | 'online' // 'local' or 'online'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookId.trim()) {
      newErrors.bookId = 'Por favor, informe o ID do livro.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.bookId)) {
      newErrors.bookId = 'ID do livro inválido.';
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'Por favor, informe o ID do aluno.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.userId)) {
      newErrors.userId = 'ID do aluno inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    try {
      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      await onSubmit({
        bookId: formData.bookId.trim(),
        studentId: formData.userId.trim(), // Changed from userId to studentId to match the schema
        loanType: formData.loanType
      });

      // Reset form after successful submission
      setFormData({
        bookId: '',
        userId: '',
        loanType: 'local'
      });
      setSuccessMessage('Empréstimo registrado com sucesso!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch {
      setErrors({ submit: 'Erro ao registrar empréstimo. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bookId" className="block text-sm font-medium mb-1">
          ID do Livro
        </label>
        <input
          type="text"
          id="bookId"
          value={formData.bookId}
          onChange={(e) => {
            setFormData({...formData, bookId: e.target.value});
            // Clear error when user starts typing
            if (errors.bookId) {
              setErrors(prev => ({...prev, bookId: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.bookId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ID do livro"
        />
        {errors.bookId && <p className="text-red-500 text-sm mt-1">{errors.bookId}</p>}
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium mb-1">
          ID do Aluno
        </label>
        <input
          type="text"
          id="userId"
          value={formData.userId}
          onChange={(e) => {
            setFormData({...formData, userId: e.target.value});
            // Clear error when user starts typing
            if (errors.userId) {
              setErrors(prev => ({...prev, userId: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.userId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ID do aluno"
        />
        {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
      </div>

      <div>
        <label htmlFor="loanType" className="block text-sm font-medium mb-1">
          Tipo de Empréstimo
        </label>
        <select
          id="loanType"
          value={formData.loanType}
          onChange={(e) => setFormData({...formData, loanType: e.target.value as 'local' | 'online'})}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="local">Presencial</option>
          <option value="online">Online</option>
        </select>
      </div>

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 rounded-md ${
          isSubmitting
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Processando...' : 'Registrar Empréstimo'}
      </button>
    </form>
  );
}