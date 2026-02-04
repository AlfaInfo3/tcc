'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

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
             <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                Sair
             </button>
             {/* Note: Logout logic to be implemented or handled by Auth flow */}
          </div>
        </div>
      </div>
    </nav>
  );
}
