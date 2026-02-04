'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const pathname = usePathname();

  if (pathname === '/admin/auth') return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    // Delete cookie logic would typically be an API call or server action
    // For now, we just redirect to auth which clears context if implemented fully
    // But since cookie is httpOnly, we need an API route to clear it.
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    window.location.href = '/admin/auth';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
              Sistema Bibliotecário
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/livros"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/livros') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Livros
              </Link>
              <Link 
                href="/admin/reservas"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/reservas') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reservas
              </Link>
              <Link 
                href="/admin/alunos"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/alunos') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alunos
              </Link>
              <Link 
                href="/admin/emprestimos"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/emprestimos') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Empréstimos
              </Link>
               <Link 
                href="/admin/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/users') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Usuários
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
             <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
             >
                Sair
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
