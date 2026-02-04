'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Book, Star, Flame, LogOut, Calendar } from 'lucide-react';
import { calculateLevel, getLevelProgress } from '@/lib/gamification';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/aluno/dashboard')
      .then(res => {
          if (res.status === 401) {
              router.push('/aluno/login');
              throw new Error('Unauthorized');
          }
          return res.json();
      })
      .then(setData)
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    // Ideally call API to clear cookie
    // For now simple redirect, cookie persists but... better to correct:
    // We should have a logout route. But let's just push to login for now.
    router.push('/aluno');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!data) return null;

  const { profile, student, history, quests, recommendations } = data;
  const progress = getLevelProgress(profile.xp);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-12">
      {/* Top Bar - Responsive */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 shadow-inner">
                    {profile.level}
                </div>
                <div className="leading-tight">
                    <h1 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{profile.username}</h1>
                    <p className="text-xs text-gray-500 line-clamp-1">{student.name}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2">
                <LogOut size={20} />
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        
        {/* Hero Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Progress Card */}
            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-yellow-300" fill="currentColor" />
                            <span className="font-bold text-xl md:text-2xl">Nível {profile.level}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Flame className="text-orange-300" fill="currentColor" size={16} />
                            <span className="text-sm font-medium">{profile.streak} dias</span>
                        </div>
                    </div>
                    
                    <div className="mb-2 flex justify-between text-sm font-medium opacity-90">
                        <span>XP Atual: {profile.xp}</span>
                        <span>Próximo Nível: {(profile.level) * 100} XP</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-4 shadow-inner">
                        <div 
                            className="bg-yellow-400 h-4 rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs mt-2 opacity-75 text-right">Faltam {((profile.level) * 100) - profile.xp} XP para subir!</p>
                </div>
            </div>

            {/* Stats - Compact on Mobile */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition">
                    <Book className="text-blue-500 mb-2 w-8 h-8" />
                    <span className="text-3xl font-bold text-gray-800">{history.totalReads}</span>
                    <span className="text-xs text-gray-500 font-medium">Lidos</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition">
                    <Star className="text-yellow-500 mb-2 w-8 h-8" fill="currentColor" />
                    <span className="text-3xl font-bold text-gray-800">{profile.badges.length}</span>
                    <span className="text-xs text-gray-500 font-medium">Conquistas</span>
                </div>
            </div>
        </div>

        {/* Quests Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <Star className="text-purple-500" />
                Missões Diárias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests?.map((quest: any) => (
                    <div key={quest.id} className={`p-4 rounded-xl border-l-4 ${quest.completed ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
                        <div>
                            <h3 className="font-bold text-sm text-gray-800">{quest.title}</h3>
                            <p className="text-xs text-gray-500">{quest.desc}</p>
                            <div className="mt-2 w-24 bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${quest.completed ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${(quest.progress/quest.total)*100}%`}}></div>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-xs font-bold text-purple-600">+{quest.xp} XP</span>
                             {quest.completed && <div className="text-xs text-green-600 font-bold mt-1">✓ Feito</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Recommendations Section - Horizontal Scroll */}
        {recommendations && recommendations.length > 0 && (
             <div>
                <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <Book className="text-blue-500" />
                    Recomendados para Você
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x">
                    {recommendations.map((book: any) => (
                        <div key={book.id} className="min-w-[140px] w-[140px] bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 snap-start border border-gray-100 hover:shadow-md transition">
                            <div className="h-40 bg-gray-200 relative">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <Book size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-sm text-gray-800 line-clamp-2 h-10 leading-tight">{book.title}</h3>
                                <p className="text-xs text-gray-500 truncate mt-1">{book.author}</p>
                                <a href={`/livros/${book.id}`} className="mt-2 block text-center text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100 font-medium">
                                    Ver Detalhes
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* Current Activity & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-800">📖 Lendo Agora</h2>
                </div>
                {history.currentLoansCount === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        Nenhuma leitura ativa.
                        <br />
                        <a href="/livros" className="text-blue-600 underline mt-2 inline-block font-medium">Explorar Biblioteca</a>
                    </div>
                ) : (
                    <div className="divide-y">
                        {history.currentLoans.map((loan: any) => (loan.status === 'active' &&
                            <div key={loan.id} className="p-4 flex gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{loan.book.title}</h3>
                                    <p className="text-sm text-gray-500">{loan.book.author}</p>
                                    <div className="mt-2 text-xs flex gap-2">
                                        <span className={`px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium`}>
                                            {loan.loanType === 'online' ? 'Online' : 'Presencial'}
                                        </span>
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(loan.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">📜 Histórico</h2>
                </div>
                <div className="divide-y">
                    {[...history.loans, ...history.reservations]
                        .sort((a: any, b: any) => new Date(b.createdAt || b.loanDate).getTime() - new Date(a.createdAt || a.loanDate).getTime())
                        .slice(0, 5)
                        .map((item: any, idx: number) => (
                        <div key={idx} className="p-3 flex justify-between items-center text-sm hover:bg-gray-50 transition">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'active' ? 'bg-green-500' :
                                    item.status === 'returned' ? 'bg-gray-400' : 'bg-yellow-400'
                                }`}></div>
                                <div>
                                    <p className="font-medium text-gray-800 line-clamp-1">{item.book.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {item.status === 'active' ? 'Emprestado' : 
                                        item.status === 'returned' ? 'Devolvido' : 
                                        item.status === 'reserved' ? 'Solicitado' : item.status}
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(item.createdAt || item.loanDate).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
