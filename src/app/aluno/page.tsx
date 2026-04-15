import Link from 'next/link';
import { BookOpen, Trophy, Star, Flame, Users, Library } from 'lucide-react';
import { OwlMascot } from '@/components/aluno/owl-mascot';

export default function AlunoLandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary pb-16 pt-12 px-4">
        {/* Background decorations */}
        <div className="absolute top-8 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-4 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-20 right-20 w-16 h-16 bg-gold/20 rounded-full blur-lg" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Floating Owl Mascot */}
          <div className="float-animate mb-6">
            <div className="inline-block">
              <OwlMascot size={140} />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Aprenda. Leia.
            <br />
            <span className="text-gold">Conquiste!</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-md mx-auto mb-8">
            Seu Clube de Leitura gamificado. Ganhe XP, suba de nível e desbloqueie conquistas a cada livro lido!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <Link
              href="/aluno/login"
              className="btn-duo bg-gold text-white border-gold-dark py-4 px-8 rounded-2xl text-lg font-black w-full text-center"
            >
              Entrar
            </Link>
            <Link
              href="/aluno/signup"
              className="btn-duo bg-white/20 text-white border-white/30 py-4 px-8 rounded-2xl text-lg font-black w-full text-center backdrop-blur-sm hover:bg-white/30"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-duo bg-white p-4 text-center slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Users className="text-secondary" size={24} />
            </div>
            <p className="text-2xl font-black text-foreground">500+</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Alunos</p>
          </div>
          <div className="card-duo bg-white p-4 text-center slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-green-50 flex items-center justify-center">
              <Library className="text-primary" size={24} />
            </div>
            <p className="text-2xl font-black text-foreground">1.2K</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Livros</p>
          </div>
          <div className="card-duo bg-white p-4 text-center slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Flame className="text-streak flame-animate" size={24} />
              </div>
            <p className="text-2xl font-black text-foreground">50+</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Conquistas</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-foreground text-center mb-8">
          Como Funciona?
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="card-duo bg-white p-5 flex items-center gap-4 slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-primary">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">Crie sua Conta</h3>
              <p className="text-sm text-muted-foreground">Conecte seu perfil ao sistema da biblioteca</p>
            </div>
            <BookOpen className="text-primary flex-shrink-0" size={24} />
          </div>

          {/* Step 2 */}
          <div className="card-duo bg-white p-5 flex items-center gap-4 slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-secondary">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">Leia Livros</h3>
              <p className="text-sm text-muted-foreground">Empreste e leia livros da biblioteca</p>
            </div>
            <Star className="text-secondary flex-shrink-0" size={24} />
          </div>

          {/* Step 3 */}
          <div className="card-duo bg-white p-5 flex items-center gap-4 slide-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-gold-dark">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">Ganhe Recompensas</h3>
              <p className="text-sm text-muted-foreground">Acumule XP, suba de nível e desbloqueie medalhas!</p>
            </div>
            <Trophy className="text-gold flex-shrink-0" size={24} />
          </div>
        </div>
      </div>

      {/* Fun Footer CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="card-duo bg-gradient-to-r from-purple/10 to-pink/10 p-8 text-center border-purple/30">
          <p className="text-lg font-black text-foreground mb-2">
            Pronto para sua aventura literária?
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Junte-se a centenas de leitores que já estão ganhando XP!
          </p>
          <Link
            href="/aluno/signup"
            className="btn-duo bg-primary text-white border-primary-dark py-4 px-10 rounded-2xl font-black inline-block"
          >
            Começar Agora
          </Link>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center pb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-bold hover:text-primary transition-colors">
          <span className="text-lg">←</span> Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
