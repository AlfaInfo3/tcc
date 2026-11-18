'use client';

import { useState } from 'react';
import { Student } from '@/types/student';

interface StudentFormProps {
  onSubmit: (studentData: Omit<Student, 'id' | 'createdAt'>) => void;
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollment: '',
    class: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, informe o nome do aluno.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, informe o email do aluno.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Por favor, informe um email válido.';
    }

    if (formData.enrollment && formData.enrollment.trim().length > 0 && formData.enrollment.trim().length < 3) {
      newErrors.enrollment = 'A matrícula deve ter pelo menos 3 caracteres.';
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Por favor, informe a turma do aluno.';
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
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        enrollment: formData.enrollment.trim(),
        class: formData.class.trim(),
        codeHash: '' // Generated on backend
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        enrollment: '',
        class: ''
      });
      setSuccessMessage('Aluno cadastrado com sucesso!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch {
      setErrors({ submit: 'Erro ao cadastrar aluno. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome
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
          placeholder="Nome completo do aluno"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({...formData, email: e.target.value});
            // Clear error when user starts typing
            if (errors.email) {
              setErrors(prev => ({...prev, email: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="email@exemplo.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="enrollment" className="block text-sm font-medium mb-1">
          Matrícula
        </label>
        <input
          type="text"
          id="enrollment"
          value={formData.enrollment}
          onChange={(e) => {
            setFormData({...formData, enrollment: e.target.value});
            // Clear error when user starts typing
            if (errors.enrollment) {
              setErrors(prev => ({...prev, enrollment: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.enrollment ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Número de matrícula (opcional)"
        />
        {errors.enrollment && <p className="text-red-500 text-sm mt-1">{errors.enrollment}</p>}
      </div>

      <div>
        <label htmlFor="class" className="block text-sm font-medium mb-1">
          Turma
        </label>
        <input
          type="text"
          id="class"
          value={formData.class}
          onChange={(e) => {
            setFormData({...formData, class: e.target.value});
            if (errors.class) {
              setErrors(prev => ({...prev, class: ''}));
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.class ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: 3º Ano A"
        />
        {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class}</p>}
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
        {isSubmitting ? 'Processando...' : 'Cadastrar Aluno'}
      </button>
    </form>
  );
}