"use client";

import { useEffect, useRef } from "react";
import { BookOpen, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/PublicNav";
import { AccordionGallery, AccordionGalleryItem } from "@/components/AccordionGallery";
import Carousel, { SlideData } from "@/components/ui/carousel";
import { LiquidGlassFooter } from "@/components/LiquidGlassFooter";

const DIFERENCIAIS_ITEMS: AccordionGalleryItem[] = [
  {
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    label: "Família",
    description: "Atendimento individual e personalizado junto às famílias por app e WhatsApp diariamente.",
    alt: "Parceria próxima com a família",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    label: "Apoio Pedagógico",
    description: "Acesso contínuo a reforço nas disciplinas exatas e humanas no contra turno.",
    alt: "Apoio e reforço pedagógico individual",
  },
  {
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
    label: "Olimpíadas",
    description: "Fomentamos a participação dos alunos nas diversas olimpíadas do conhecimento regionais e nacionais.",
    alt: "Preparação para olimpíadas do conhecimento",
  },
  {
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop",
    label: "Viagens",
    description: "Roteiros de saídas propõem atividades pedagógicas conectadas com a sala de aula e formação de mundo.",
    alt: "Roteiros de viagens e saídas pedagógicas",
  },
];

const TURMAS_SLIDES: SlideData[] = [
  {
    title: "Fundamental II",
    badge: "6º ao 9º Ano",
    description: "Construindo bases cognitivas e preparo para convivência, leitura e os desafios da juventude.",
    button: "Explorar Turma",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop",
    link: "#contato",
  },
  {
    title: "Ensino Médio",
    badge: "1ª à 3ª Série",
    description: "Aprofundamento focado no ENEM e nos principais vestibulares, preparando para o futuro.",
    button: "Explorar Turma",
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop",
    link: "#contato",
  },
  {
    title: "Téc. Profissional",
    badge: "Informática & Administração",
    description: "Formação técnica integrada ao Ensino Médio, preparando para o mercado de trabalho.",
    button: "Explorar Turma",
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1400&auto=format&fit=crop",
    link: "#contato",
  },
  {
    title: "E.J.A.",
    badge: "Educação de Jovens e Adultos",
    description: "Nunca é tarde para retomar os estudos e conquistar seu diploma no período noturno.",
    button: "Explorar Turma",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
    link: "#contato",
  },
];

export default function SchoolLandingPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Barra de progresso de scroll em tempo real no topo
      gsap.to(".gsap-scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });

      // 1. HERO ENTRANCE (Imediata no carregamento)
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".hero-badge", {
          opacity: 0,
          y: -25,
          duration: 0.8,
          delay: 0.1,
        })
        .from(
          ".hero-title-line",
          {
            opacity: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.9,
          },
          "-=0.4"
        )
        .from(
          ".hero-desc",
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-cta-btn",
          {
            opacity: 0,
            scale: 0.92,
            y: 15,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // Efeito Parallax suave na imagem de fundo do Hero ao rolar
      gsap.to(".hero-bg-img", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. SEÇÃO BIBLIOTECA (Fade-in e revelação de texto)
      gsap.from(".sobre-text-content > *", {
        scrollTrigger: {
          trigger: "#sobre",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -30,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from(".sobre-student-img", {
        scrollTrigger: {
          trigger: "#sobre",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.94,
        x: 40,
        duration: 0.95,
        ease: "power3.out",
      });

      // 3. SEÇÃO NOSSOS DIFERENCIAIS
      gsap.from(".ensino-header > *", {
        scrollTrigger: {
          trigger: "#ensino",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.75,
        ease: "power2.out",
      });

      gsap.from(".diferenciais-gallery", {
        scrollTrigger: {
          trigger: "#ensino",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 35,
        duration: 0.85,
        ease: "power3.out",
      });

      // 4. SEÇÃO EXPLORE AS TURMAS
      gsap.from(".turmas-header > *", {
        scrollTrigger: {
          trigger: "#turmas",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.75,
        ease: "power2.out",
      });

      gsap.from(".turmas-carousel-wrapper", {
        scrollTrigger: {
          trigger: "#turmas",
          start: "top 78%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: "power3.out",
      });

      // 5. FOOTER ENTRANCE
      gsap.from("#contato .container", {
        scrollTrigger: {
          trigger: "#contato",
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: "power2.out",
      });

      // Recalcula posições do ScrollTrigger após renderização completa do DOM
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimeout);
    }, mainContainerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  return (
    <div ref={mainContainerRef} className="school-home min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 relative">
      {/* Indicador visual de progresso de scroll GSAP no topo da tela */}
      <div 
        className="gsap-scroll-progress fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 via-[#E9DCC3] to-blue-500 z-[9999] origin-left pointer-events-none"
        style={{ transform: "scaleX(0)" }}
      />
      <PublicNav />
      <main>
        {/* HERO SECTION COM PALETA AZUL INSTITUCIONAL */}
        <section 
          className="hero-section relative pt-32 pb-40 sm:pt-40 sm:pb-52 text-white overflow-hidden bg-[#060F33] min-h-[92vh] flex items-center justify-center"
          style={{
            '--blue-light': '#60A5FA',
            '--blue-primary': '#2563EB',
            '--navy-deep': '#060F33',
          } as React.CSSProperties}
        >
          {/* Background Image with Layered Gradients */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://www.rvcfm.com.br/images/2025/11/20251113173318_l_WhatsAppImage2025-11-13at14.15.401.jpg" 
              alt="Colégio Estadual Laurentino Martins" 
              className="hero-bg-img w-full h-full object-cover scale-105 saturate-[1.12] opacity-90"
            />
            {/* 3) Light overall tint rgba(11,27,92,.35) */}
            <div className="absolute inset-0 bg-[#0B1B5C]/35 pointer-events-none" />

            {/* 1) Layered bottom-to-top gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060F33] via-[#0B1B5C]/70 to-transparent pointer-events-none" />

            {/* 2) Radial gradient centered behind the text */}
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,_rgba(6,15,51,0.75)_0%,_rgba(6,15,51,0.2)_60%,_transparent_100%)] pointer-events-none" />
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center justify-center h-full text-center">
            {/* Content block: max-w-4xl, centered, vertically placed slightly above center (pb-24 to clear wave) */}
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center pb-20 sm:pb-24 pt-4 sm:pt-8">
              
              {/* Badge: border border-[#60A5FA]/40, ícone e detalhes em Azul Claro */}
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#60A5FA]/40 text-sm tracking-wide font-medium text-white shadow-sm mb-4 md:mb-5">
                <BookOpen strokeWidth={1.8} className="size-4 text-[#60A5FA]" />
                <span>Tradição & Excelência em Educação Pública</span>
              </div>

              {/* Title: "Colégio Estadual" em Branco (#FFFFFF), "Laurentino Martins" em Azul Luminoso (#60A5FA) */}
              <h1 className="hero-title text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-normal leading-[1.05] text-balance mb-5 md:mb-6">
                <span className="hero-title-line block text-white">Colégio Estadual</span>
                <span className="hero-title-line block text-[#60A5FA]">Laurentino Martins</span>
              </h1>

              {/* Motto */}
              <p className="hero-desc text-lg md:text-xl font-medium text-white/90 max-w-[32ch] mx-auto text-balance leading-relaxed mb-8 md:mb-10">
                Nosso lema é <span className="italic">&ldquo;Educar para construir&rdquo;</span>
              </p>
              
              {/* Buttons: Primário Azul (#2563EB) com Texto Branco | Secundário Contorno Branco */}
              <div className="hero-cta-btn flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => scrollToSection("sobre")}
                  className="w-full sm:w-auto h-12 px-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 shadow-md shadow-black/25 cursor-pointer flex items-center justify-center"
                >
                  Conheça a Escola
                </button>
                <button 
                  onClick={() => scrollToSection("turmas")}
                  className="w-full sm:w-auto h-12 px-7 rounded-full bg-transparent text-white font-semibold text-base border border-white/50 transition-all duration-200 hover:bg-white/10 active:translate-y-0 cursor-pointer flex items-center justify-center"
                >
                  Nossas Turmas
                </button>
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

        {/* BIBLIOTECA SECTION COM FOTOGRAFIA REAL */}
        <section id="sobre" className="py-20 lg:py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
              {/* Text Side */}
              <div className="sobre-text-content flex-1 space-y-6 text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
                  Ambiente de Estudo e <br className="hidden lg:block"/> Biblioteca Integrada
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-[65ch]">
                  Incentivamos o hábito da leitura através do nosso acervo digital e físico. Nosso espaço é preparado para focar no crescimento individual de cada aluno.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg rounded-full shadow-md shadow-black/15 motion-safe:hover:scale-[1.02] transition-transform cursor-pointer">
                    <Link href="/livros">
                      Acessar Acervo
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Image Side: Estudante em momento de leitura */}
              <div className="flex-1 w-full relative flex justify-center items-end min-h-[420px] mt-10 lg:mt-0">
                <img 
                  src="/Imagens/garoto.png" 
                  alt="Estudante em momento de leitura" 
                  className="sobre-student-img max-h-[400px] sm:max-h-[480px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] relative z-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* NOSSOS DIFERENCIAIS */}
        <section id="ensino" className="py-20 lg:py-24 bg-slate-50/60 border-y border-slate-200">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="ensino-header text-center mb-16 max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800">
                Nossos Diferenciais
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-[65ch] mx-auto">
                Um conjunto de atividades que incentivam os alunos a ampliarem suas habilidades e competências de maneira participativa e enriquecedora.
              </p>
            </div>

            <div className="diferenciais-gallery max-w-6xl mx-auto">
              <AccordionGallery
                items={DIFERENCIAIS_ITEMS}
                defaultIndex={1}
                expandRatio={0.48}
                trigger="hover"
                height={460}
                gap={12}
                radius={20}
                accentColor="#2563eb"
                overlayColor="#0b1329"
                grayscale={true}
                showLabels={true}
              />
            </div>
          </div>
        </section>

        {/* COMPROMISSO PEDAGÓGICO E FORMAÇÃO CIDADÃ */}
        <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
          <div className="container mx-auto px-6 lg:px-12 max-w-5xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight max-w-3xl mx-auto">
              Educação pública séria, humana e conectada ao futuro
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-[65ch] mx-auto">
              No Colégio Estadual Laurentino Martins, o lema <strong className="text-slate-800 font-bold">&quot;Educar para construir&quot;</strong> orienta cada etapa da nossa jornada escolar. Oferecemos um ambiente de acolhimento e disciplina pedagógica, preparando os estudantes para os desafios éticos e práticos da vida em sociedade.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Acompanhamento Docente</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Corpo de professores concursados e comprometidos com a evolução individual de cada turma, apoiando o aprendizado contínuo.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Comunidade e Família</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Diálogo constante entre equipe gestora, professores e responsáveis para manter um ambiente seguro, saudável e acolhedor.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Desenvolvimento Integral</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Atividades culturais, projetos esportivos e formação técnica para ampliar horizontes profissionais e cidadãos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAMS SECTION COM FOTOGRAFIAS REAIS EM TODAS AS TURMAS */}
        <section id="turmas" className="py-20 bg-slate-50/60 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="turmas-header text-center mb-16 max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800">
                Explore as Turmas
              </h2>
            </div>

            <div className="turmas-carousel-wrapper relative overflow-hidden w-full py-4 pb-28">
              <Carousel slides={TURMAS_SLIDES} />
            </div>
          </div>
        </section>

      </main>

      {/* LIQUID GLASS FOOTER */}
      <LiquidGlassFooter onNavigate={scrollToSection} />
    </div>
  );
}


