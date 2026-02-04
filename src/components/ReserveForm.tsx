'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReserveFormProps {
  bookId: string;
}

export function ReserveForm({ bookId }: ReserveFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    className: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, informe seu nome.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!formData.className.trim()) {
      newErrors.className = 'Por favor, informe sua turma.';
    } else if (formData.className.trim().length < 1) {
      newErrors.className = 'A turma não pode estar vazia.';
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
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          className: formData.className.trim(),
          bookId
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na reserva');
      }

      // Reset form after successful submission
      setFormData({ name: '', className: '' });
      setSuccessMessage('Reserva realizada com sucesso!');

      // Clear success message after 2 seconds and redirect
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/livros');
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Erro ao realizar a reserva. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Seu Nome
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({...formData, name: e.target.value});
            // Clear error when user starts typing
            if (errors.name) {
              setErrors(prev => ({...prev, name: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite seu nome completo"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="className" className="block text-sm font-medium mb-1">
          Turma
        </label>
        <input
          type="text"
          id="className"
          value={formData.className}
          onChange={(e) => {
            setFormData({...formData, className: e.target.value});
            // Clear error when user starts typing
            if (errors.className) {
              setErrors(prev => ({...prev, className: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.className ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: 8º ano A"
        />
        {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
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
        {isSubmitting ? 'Processando...' : 'Reservar Livro'}
      </button>
    </form>
  );
}