'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BubblyInput, BubblyButton } from '@/components/aluno/bubbly-form';
import { OwlMascot } from '@/components/aluno/owl-mascot';
import { User, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {/* Top decorative area */}
      <div className="bg-gradient-to-br from-primary to-primary-light pt-8 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-4 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-6 w-16 h-16 bg-white/10 rounded-full blur-lg" />

        <div className="relative z-10">
          <div className="float-animate inline-block mb-4">
            <OwlMascot size={100} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-white/80 font-medium">Entre para continuar sua aventura</p>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex-1 px-4 -mt-10 relative z-20 max-w-md mx-auto w-full pb-8">
        <div className="card-duo bg-white p-6 space-y-5 shadow-lg slide-up">
          {/* Success message */}
          {registered && (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-bold text-center border-2 border-green-200">
              Conta criada com sucesso! Pode entrar.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-danger p-4 rounded-2xl text-sm font-bold text-center border-2 border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <BubblyInput
              label="Usuário"
              placeholder="Seu nome de usuário"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              icon={<User size={18} />}
            />

            <BubblyInput
              label="Senha"
              type="password"
              placeholder="Sua senha secreta"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              icon={<Lock size={18} />}
            />

            <BubblyButton type="submit" loading={loading}>
              Entrar
            </BubblyButton>
          </form>
        </div>

        {/* Sign up link */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link href="/aluno/signup" className="text-primary font-bold hover:underline">
              Criar agora
            </Link>
          </p>

          <Link href="/aluno" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-bold hover:text-primary transition-colors">
            <span>←</span> Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div></div>}>
            <LoginForm />
        </Suspense>
    );
}
