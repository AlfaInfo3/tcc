import { Icon } from "@iconify/react";
import Image from "next/image";
import { PublicNav } from "@/components/PublicNav";
import Link from "next/link";
import { LiquidGlassFooter } from "@/components/LiquidGlassFooter";
import TiltedCard from "@/components/TiltedCard";

export const metadata = {
  title: "Sobre a Escola | Colégio Estadual Laurentino Martins",
  description:
    "Educação que transforma futuros. Conheça o Colégio Estadual Laurentino Martins em Goianésia-GO, nossa história, pilares e comunidade escolar.",
};

const possibilities = [
  {
    icon: "solar:book-bookmark-bold-duotone",
    title: "Aprendizagem Sólida",
    sub: "Pilar Pedagógico",
    desc: "Conhecimento consistente, incentivo contínuo à leitura e desenvolvimento individual de cada estudante.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: "solar:users-group-rounded-bold-duotone",
    title: "Comunidade Viva",
    sub: "União & Família",
    desc: "Participação ativa da família, diálogo acolhedor e construção diária de respeito e pertencimento mútuo.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: "solar:cup-star-bold-duotone",
    title: "Conquistas Reais",
    sub: "Mérito & Futuro",
    desc: "Projetos científicos práticos, olimpíadas do conhecimento e experiências formativas para a vida inteira.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  },
];

const schoolLifePhotos = [
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
    alt: "Aulas participativas e didática ativa",
    tag: "Em Sala de Aula",
    title: "Didática e Foco",
    caption: "Aulas dinâmicas com acompanhamento pedagógico próximo e professores dedicados.",
  },
  {
    src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop",
    alt: "Laboratórios e tecnologia prática",
    tag: "Tecnologia Prática",
    title: "Inovação e Projetos",
    caption: "Laboratórios práticos de informática e ciências que estimulam a criatividade dos alunos.",
  },
  {
    src: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop",
    alt: "Espaço de convivência saudável",
    tag: "Convivência Saudável",
    title: "Ambiente Acolhedor",
    caption: "Espaço escolar seguro focado no respeito mútuo, integração saudável e disciplina consciente.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      <PublicNav />

      {/* ── SEÇÃO HERO (LAYOUT DA IMAGEM 1 COM CONTRASTE COM A NAVBAR) ── */}
      <section className="relative pt-36 sm:pt-44 pb-20 bg-[#f8fafc] border-b border-slate-200/90 overflow-hidden">
        {/* Ambient glow bem suave no fundo */}
        <div className="absolute top-0 right-1/4 size-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 size-80 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Bloco de Texto (Esquerda) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Educação pública que transforma futuros.
              </h1>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-[48ch]">
                Conheça o Colégio Estadual Laurentino Martins: tradição, dedicação pedagógica e oportunidades para nossos estudantes em Goianésia.
              </p>
              <div className="pt-2">
                <a
                  href="#possibilidades"
                  className="inline-flex items-center gap-2.5 bg-[#1e40af] hover:bg-blue-800 active:scale-95 text-white font-bold px-7 py-4 rounded-xl transition-all text-sm shadow-md shadow-blue-900/15"
                >
                  <span>Conheça a escola</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            {/* Imagem do Colégio (Direita) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100 relative">
                <Image
                  src="/Imagens/fachada-laurentino.jpg"
                  alt="Fachada do Colégio Estadual Laurentino Martins em Goianésia-GO"
                  width={1080}
                  height={608}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-[280px] sm:h-[390px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── UMA ESCOLA, MUITAS POSSIBILIDADES (3D TILTED CARDS) ───── */}
      <section id="possibilidades" className="py-20 bg-[#edf2f7] border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-14 space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Uma escola, muitas possibilidades
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Princípios pedagógicos e humanos que guiam cada jornada de aprendizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {possibilities.map((item) => (
              <TiltedCard
                key={item.title}
                imageSrc={item.image}
                altText={item.title}
                containerHeight="380px"
                imageHeight="380px"
                containerWidth="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.04}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="size-full flex flex-col justify-between p-7 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/25 text-white rounded-[20px] select-none border border-white/10 shadow-inner group">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20 shadow-xs">
                        <Icon icon={item.icon} className="size-4" />
                        <span>{item.sub}</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                        {item.title}
                      </h3>
                      <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-xs">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── A VIDA NA NOSSA ESCOLA (3D TILTED CARDS FOTOGRÁFICOS) ──── */}
      <section className="py-20 lg:py-24 bg-[#f8fafc] text-slate-900 border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-14 space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A vida na nossa escola
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Ambiente acolhedor, projetos pedagógicos ativos e integração diária entre alunos e professores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schoolLifePhotos.map((photo) => (
              <TiltedCard
                key={photo.alt}
                imageSrc={photo.src}
                altText={photo.alt}
                containerHeight="350px"
                imageHeight="350px"
                containerWidth="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.04}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="size-full flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 text-white rounded-[20px] select-none border border-white/10 shadow-inner group">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20 shadow-xs">
                        {photo.tag}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {photo.title}
                      </h3>
                      <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-xs">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── NARRATIVA HISTÓRICA E COMPROMISSO PÚBLICO (FUNDO CLARO) ─ */}
      <section className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200/80">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Tradição e vocação comunitária em Goianésia
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-medium max-w-[65ch]">
              O Colégio Estadual Laurentino Martins consolidou sua trajetória como uma das principais referências públicas de Goianésia. Fundamentada no lema <strong className="text-slate-900">&quot;Educar para construir&quot;</strong>, a unidade escolar oferece formação humana, ética e acadêmica para jovens que ingressam no Ensino Fundamental II, no Ensino Médio regular, em cursos técnicos integrados e na Educação de Jovens e Adultos (EJA).
            </p>
            <p className="text-slate-600 text-base leading-relaxed font-medium max-w-[65ch]">
              Contamos com professores concursados, equipe pedagógica dedicada, salas climatizadas, laboratório de informática e quadra poliesportiva. Nosso foco é assegurar que cada estudante encontre aqui os alicerces necessários para avançar rumo ao ensino superior e ao mercado de trabalho.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/matriculas"
              className="inline-flex items-center gap-2 bg-[#1e40af] hover:bg-blue-800 active:scale-95 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm shadow-sm"
            >
              Guia de Matrículas
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 border border-slate-200 font-bold px-7 py-3.5 rounded-xl transition-all text-sm shadow-2xs"
            >
              Falar com a Secretaria
            </Link>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ OFICIAL ─────────────────────────────────────── */}
      <LiquidGlassFooter />
    </div>
  );
}
