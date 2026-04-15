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
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Criar Perfil 🚀</h1>
            <p className="text-muted-foreground text-sm">Preencha seus dados para conectar seu histórico.</p>
        </div>

        {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm mb-4 border border-destructive/20">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Seu Nome Completo</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground"
                    placeholder="Igual usado na biblioteca"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sua Turma</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground"
                    placeholder="Ex: 1º A"
                    value={formData.className}
                    onChange={e => setFormData({...formData, className: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">Usado para encontrar seus empréstimos antigos.</p>
            </div>

            <div className="border-t border-border pt-4 mt-4">
                <label className="block text-sm font-medium text-foreground mb-1">Escolha um Usuário</label>
                <input 
                    type="text" 
                    required
                    className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground"
                    placeholder="Ex: leitor.campeao"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Senha Secreta</label>
                <input 
                    type="password" 
                    required
                    className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-foreground"
                    placeholder="******"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition"
            >
                {loading ? 'Criando...' : 'Começar Aventura!'}
            </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
            Já tem conta? <Link href="/aluno/login" className="text-primary hover:underline">Entrar</Link>
        </p>
        <div className="text-center mt-4">
             <Link href="/aluno" className="text-xs text-muted-foreground hover:underline">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
