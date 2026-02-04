import Link from 'next/link';
import { BookOpen, Trophy, Star } from 'lucide-react';

export default function AlunoLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Hero Icon */}
        <div className="mx-auto bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">
            <Trophy className="w-12 h-12 text-blue-600" />
        </div>

        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Clube de Leitura</h1>
            <p className="text-gray-600">
                Acompanhe seu progresso, ganhe medalhas e suba de nível a cada livro lido! 🚀
            </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <Link 
                href="/aluno/login"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
                Entrar
            </Link>
            
            <Link 
                href="/aluno/signup"
                className="w-full bg-white text-blue-600 border-2 border-blue-100 py-3 rounded-xl font-bold text-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
                Criar Conta
            </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Como funciona?</p>
            <div className="flex justify-center gap-6 text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1">
                    <BookOpen className="w-6 h-6 text-green-500" />
                    <span>Leia Livros</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span>Ganhe XP</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Trophy className="w-6 h-6 text-purple-500" />
                    <span>Conquiste</span>
                </div>
            </div>
        </div>
        
        <Link href="/" className="inline-block text-gray-400 text-sm hover:underline">
            ← Voltar ao site da biblioteca
        </Link>
      </div>
    </div>
  );
}
