'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [formData, setFormData] = useState({
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
        const res = await fetch('/api/aluno/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            router.push('/aluno/dashboard');
        } else {
            const data = await res.json();
            setError(data.error || 'Erro ao entrar');
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
            <h1 className="text-2xl font-bold text-gray-800">Bem-vindo de volta! 👋</h1>
            <p className="text-gray-500 text-sm">Entre para ver suas medalhas.</p>
        </div>

        {registered && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 text-center">
                Conta criada com sucesso! Pode entrar.
            </div>
        )}

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                    type="password" 
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
                {loading ? 'Entrando...' : 'Acessar Painel'}
            </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
            Ainda não tem conta? <Link href="/aluno/signup" className="text-blue-600 hover:underline">Criar agora</Link>
        </p>
         <div className="text-center mt-4">
             <Link href="/aluno" className="text-xs text-gray-400 hover:underline">Voltar</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
