"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PublicNav } from "@/components/PublicNav";

export default function SchoolLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      <PublicNav />
      <main>
        {/* HERO SECTION COM IMAGEM DE FUNDO DA ESCOLA */}
        <section className="relative pt-32 pb-40 sm:pt-40 sm:pb-52 text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://www.rvcfm.com.br/images/2025/11/20251113173318_l_WhatsAppImage2025-11-13at14.15.401.jpg" 
              alt="Colégio Estadual Laurentino Martins" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-linear-to-t from-blue-900 via-transparent to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center justify-center h-full text-center">
            <div className="space-y-6 sm:space-y-8 max-w-4xl py-8 lg:py-12">
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-lg text-white">
                Colégio Estadual <br className="hidden sm:block"/>
                <span className="text-[#FFD166]">Laurentino Martins</span>
              </h1>
              <p className="text-lg sm:text-2xl text-blue-50 leading-relaxed font-medium mx-auto max-w-2xl drop-shadow">
                Nosso lema é "Educar para construir"
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
                <Button className="bg-[#FFD166] hover:bg-[#FFC132] text-slate-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                  Conheça a Escola
                </Button>
              </div>
            </div>
          </div>

          {/* Wavy bottom divider svg */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
            <svg className="relative block w-full h-[40px] sm:h-[80px] lg:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,130.2,201.5,122.9,243.6,118.5,285.8,103.3,321.39,56.44Z" className="fill-white"></path>
            </svg>
          </div>
        </section>

        {/* BIBLIOTECA SECTION COM FOTO DO GAROTO */}
        <section id="sobre" className="py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
              {/* Text Side */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <Badge className="px-4 py-2 text-sm font-bold bg-[#EF476F]/10 text-[#EF476F] border-none rounded-full uppercase tracking-wider">
                  Leitura e Foco
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
                  Ambiente de Estudo e <br className="hidden lg:block"/> Biblioteca Integrada
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Incentivamos o hábito da leitura através do nosso acervo digital e físico. Nosso espaço é preparado para focar no crescimento individual de cada aluno.
                </p>
                <div className="pt-4">
                  <Button className="bg-[#1e40af] hover:bg-blue-800 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
                    Acessar Acervo
                  </Button>
                </div>
              </div>
              
              {/* Image Side */}
              <div className="flex-1 w-full relative flex justify-center items-end min-h-[420px] mt-10 lg:mt-0">
                  <img 
                    src="/Imagens/garoto.png" 
                    alt="Estudante em momento de leitura" 
                    className="max-h-[400px] sm:max-h-[480px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.20)] relative z-0"
                  />
                  <div className="absolute bottom-4 left-2 sm:left-0 z-10">
                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl flex items-center gap-3 shadow-xl border border-slate-100">
                      <div className="size-12 rounded-xl bg-[#FFD166]/20 flex items-center justify-center text-amber-600 shrink-0">
                        <Icon icon="solar:book-bookmark-bold" className="size-6" />
                      </div>
                      <div className="text-left pr-3">
                        <h4 className="font-black text-slate-800 text-sm">Mais de 2.000 títulos</h4>
                        <p className="text-xs text-slate-500 font-bold">Disponíveis para empréstimo</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOSSOS DIFERENCIAIS (Lúdico, mas no formato de de grid do Tera) */}
        <section id="ensino" className="py-20 lg:py-24 bg-white border-y border-slate-200">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-[#1e40af]/10 text-[#1e40af] border-none rounded-full uppercase tracking-wider">
                Nosso Ensino
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800">
                Nossos Diferenciais
              </h2>
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
                Um conjunto de atividades que incentivam os alunos a ampliarem suas habilidades e competências de maneira super divertida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl mx-auto">
              
              <div className="text-center space-y-4 group">
                <div className="size-20 mx-auto rounded-[2rem] bg-blue-50 flex items-center justify-center text-[#1e40af] group-hover:-translate-y-2 transition-transform shadow-sm">
                  <Icon icon="solar:heart-angle-bold" className="size-10" />
                </div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Família</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium px-2">
                  Atendimento individual e personalizado junto às famílias por app e WhatsApp diariamente.
                </p>
              </div>

              <div className="text-center space-y-4 group">
                <div className="size-20 mx-auto rounded-[2rem] bg-[#FFD166]/20 flex items-center justify-center text-amber-600 group-hover:-translate-y-2 transition-transform shadow-sm">
                  <Icon icon="solar:book-bookmark-bold" className="size-10" />
                </div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Apoio Pedagógico</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium px-2">
                  Acesso contínuo a reforço nas disciplinas exatas e humanas no contra turno.
                </p>
              </div>

              <div className="text-center space-y-4 group">
                <div className="size-20 mx-auto rounded-[2rem] bg-[#06D6A0]/20 flex items-center justify-center text-[#06D6A0] group-hover:-translate-y-2 transition-transform shadow-sm">
                  <Icon icon="solar:medal-star-circle-bold" className="size-10" />
                </div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Olimpíadas</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium px-2">
                  Fomentamos a participação dos alunos nas diversas olimpíadas do conhecimento regionais e nacionais.
                </p>
              </div>

              <div className="text-center space-y-4 group">
                <div className="size-20 mx-auto rounded-[2rem] bg-[#EF476F]/10 flex items-center justify-center text-[#EF476F] group-hover:-translate-y-2 transition-transform shadow-sm">
                  <Icon icon="solar:globus-bold" className="size-10" />
                </div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Viagens</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium px-2">
                  Roteiros de saídas propõem atividades pedagógicas conectadas com a sala de aula e formação de mundo.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PROGRAMS SECTION COPIADO DO AZUL COM CARD COLORIDOS */}
        <section id="turmas" className="py-20 bg-[#f8fafc] relative overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD166]/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-[#EF476F]/10 text-[#EF476F] border-none rounded-full uppercase tracking-wider">
                Estrutura
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800">
                Explore as Turmas
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
              {/* Card 1 */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img src="/Imagens/Gemini_Generated_Image_uw3fjkuw3fjkuw3f.png" alt="Fundamental II" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100">FUNDAMENTAL II</div>
                </div>
                <CardHeader className="pt-6 pb-2 px-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                      <Icon icon="solar:backpack-bold" className="size-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">Fundamental II</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 font-medium text-[15px] leading-relaxed">
                    Construindo bases cognitivas e preparo para convivência, leitura e os desafios da juventude.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-6 text-slate-600">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">EXATAS</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">HUMANAS</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img src="/Imagens/Gemini_Generated_Image_sl0j0msl0j0msl0j.png" alt="Ensino Médio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100">MÉDIO</div>
                </div>
                <CardHeader className="pt-6 pb-2 px-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                      <Icon icon="solar:microscope-bold" className="size-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">Ensino Médio</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 font-medium text-[15px] leading-relaxed">
                    Aprofundamento focado no ENEM e nos principais vestibulares, preparando para o futuro.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-6">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">ENEM</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">VESTIBULARES</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 - TEC Profissional */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-600">
                  <Icon icon="solar:laptop-minimalistic-bold-duotone" className="size-28 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100">TÉC. PROFISSIONAL</div>
                </div>
                <CardHeader className="pt-6 pb-2 px-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                      <Icon icon="solar:laptop-bold" className="size-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">Téc. Profissional</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 font-medium text-[15px] leading-relaxed">
                    Formação profissional técnica integrada ao Ensino Médio, preparando para o mercado de trabalho.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-6">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">INFORMÁTICA</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">ADMINISTRAÇÃO</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 - EJA */}
              <Card className="border border-slate-200 shadow-sm hover:shadow-md rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden flex items-center justify-center bg-slate-100">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]"></div>
                  <Icon icon="solar:user-speak-rounded-bold-duotone" className="size-32 text-amber-500/80 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100">E.J.A.</div>
                </div>
                <CardHeader className="pt-6 pb-2 px-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                      <Icon icon="solar:diploma-bold" className="size-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">E.J.A.</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 font-medium text-[15px] leading-relaxed">
                    Educação de Jovens e Adultos — nunca é tarde para retomar os estudos e conquistar seu diploma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-6">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">NOTURNO</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold tracking-wide">INCLUSIVO</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER NO AZUL BEM LIMPO DA REFERENCIA AZUL */}
      <footer id="contato" className="bg-[#1e40af] pt-20 pb-10 text-blue-200">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
              <Icon icon="solar:book-bookmark-bold" className="size-8" />
              <span className="text-2xl font-black tracking-tight text-white">Laurentino Martins</span>
            </div>
              <p className="text-blue-200/80 font-medium max-w-sm leading-relaxed">
                Escola pública estadual localizada em Goi­nésia-GO. Nossa missão é &ldquo;Educar para construir!&rdquo;
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex size-12 items-center justify-center rounded-full bg-blue-800/50 hover:bg-white hover:text-[#1e40af] transition-colors">
                  <Icon icon="fa-brands:facebook-f" className="size-6" />
                </a>
                <a href="#" className="flex size-12 items-center justify-center rounded-full bg-blue-800/50 hover:bg-[#EF476F] hover:text-white transition-colors">
                  <Icon icon="fa-brands:instagram" className="size-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-black mb-6 text-lg tracking-wide uppercase text-sm">Links Úteis</h4>
              <ul className="space-y-4 font-medium text-blue-200/90">
                <li><a href="/#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="/#ensino" className="hover:text-white transition-colors">Infraestrutura</a></li>
                <li><a href="/#turmas" className="hover:text-white transition-colors">Matrículas</a></li>
                <li><a href="/#contato" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-6 text-lg tracking-wide uppercase text-sm">Turmas</h4>
              <ul className="space-y-4 font-medium text-blue-200/90">
                <li><a href="/#turmas" className="hover:text-white transition-colors">Ensino Fundamental</a></li>
                <li><a href="/#turmas" className="hover:text-white transition-colors">Ensino Médio</a></li>
                <li><a href="/#turmas" className="hover:text-white transition-colors">Téc. Profissional</a></li>
                <li><a href="/#turmas" className="hover:text-white transition-colors">E.J.A.</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-6 text-lg tracking-wide uppercase text-sm">Contato</h4>
              <ul className="space-y-5 font-medium text-blue-200/90 text-sm">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-blue-800/50 rounded-full shrink-0">
                    <Icon icon="solar:map-point-bold" className="size-5 text-white" />
                  </div>
                  <span className="mt-1">R. 36, N 391 &mdash; São Cristóvão <br/> Goi­nésia &mdash; GO</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 bg-blue-800/50 rounded-full shrink-0">
                    <Icon icon="solar:phone-bold" className="size-5 text-white" />
                  </div>
                  <span>(62) 9 8415-2867</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-2 bg-blue-800/50 rounded-full shrink-0">
                    <Icon icon="fa-brands:instagram" className="size-5 text-white" />
                  </div>
                  <a href="https://www.instagram.com/colestaduallaurentinomartins" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@colestaduallaurentinomartins</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-blue-800/50 text-center text-sm font-medium flex flex-col sm:flex-row justify-between items-center gap-4 text-blue-200/70">
            <p>© 2026 Laurentino Martins. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
