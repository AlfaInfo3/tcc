'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const res = await fetch('/api/aluno/auth/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            // Auto login logic could be here, but let's redirect to login for simplicity/security
            router.push('/aluno/login?registered=true');
        } else {
            setError(data.error || 'Erro ao criar conta');
        }
    } catch(e) {
        setError('Erro de conexão');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Criar Perfil 🚀</h1>
            <p className="text-gray-500 text-sm">Preencha seus dados para conectar seu histórico.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome Completo</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Igual usado na biblioteca"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sua Turma</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 1º A"
                    value={formData.className}
                    onChange={e => setFormData({...formData, className: e.target.value})}
                />
                <p className="text-xs text-gray-400 mt-1">Usado para encontrar seus empréstimos antigos.</p>
            </div>

            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Escolha um Usuário</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: leitor.campeao"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Secreta</label>
                <input 
                    type="password" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="******"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
                {loading ? 'Criando...' : 'Começar Aventura!'}
            </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
            Já tem conta? <Link href="/aluno/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
        <div className="text-center mt-4">
             <Link href="/aluno" className="text-xs text-gray-400 hover:underline">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
