'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{name: string, class: string, username?: string, password?: string}>({ name: '', class: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch('/api/alunos/manage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert('Aluno cadastrado com sucesso!');
            router.push('/admin/alunos');
            router.refresh();
        } else if (res.status === 409) {
            const data = await res.json();
            alert(`ATENÇÃO: Este aluno já existe no sistema.\nNome: ${data.student.name}\nTurma: ${data.student.class}`);
        } else {
            alert('Erro ao cadastrar');
        }
    } catch (e) {
        alert('Erro de conexão');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Adicionar Aluno</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input 
                type="text" 
                required
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Turma</label>
            <input 
                type="text" 
                required
                placeholder="Ex: 3º Ano A"
                className="w-full border p-2 rounded"
                value={formData.class}
                onChange={e => setFormData({...formData, class: e.target.value})}
            />
        </div>
        
        <div className="border-t pt-4 mt-6">
            <h3 className="font-bold text-gray-700 mb-2">Acesso Gamificado (Opcional)</h3>
            <p className="text-xs text-gray-400 mb-4">Adicione usuário e senha se o aluno for usar o aplicativo.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Usuário</label>
                    <input 
                        type="text" 
                        className="w-full border p-2 rounded"
                        value={formData.username || ''}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input 
                        type="password" 
                        className="w-full border p-2 rounded"
                        value={formData.password || ''}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
            {loading ? 'Salvando...' : 'Cadastrar Aluno'}
        </button>
      </form>
    </div>
  );
}
