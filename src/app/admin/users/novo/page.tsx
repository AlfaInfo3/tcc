'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAdminUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
      name: '', 
      email: '', 
      password: '',
      role: 'admin' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch('/api/admin/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert('Usuário cadastrado com sucesso!');
            router.push('/admin/users');
            router.refresh();
        } else {
            const data = await res.json();
            alert(`Erro: ${data.error || 'Falha ao cadastrar'}`);
        }
    } catch (e) {
        alert('Erro de conexão');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Adicionar Usuário Admin</h1>
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
                type="email" 
                required
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
                type="password" 
                required
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <select 
                className="w-full border p-2 rounded"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
            >
                <option value="admin">Administrador (Bibliotecário)</option>
                <option value="manager">Gerente (Supervisão)</option>
            </select>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
            {loading ? 'Salvando...' : 'Cadastrar Usuário'}
        </button>
      </form>
    </div>
  );
}
