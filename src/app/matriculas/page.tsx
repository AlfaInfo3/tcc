'use client';

import Image from "next/image";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { PublicNav } from "@/components/PublicNav";
import { LiquidGlassFooter } from "@/components/LiquidGlassFooter";
import TiltedCard from "@/components/TiltedCard";
import { Modal } from "@/components/ui/modal";
import { 
  Tick01Icon, 
  Cancel01Icon, 
  ArrowUpRight01Icon, 
  WhatsappIcon, 
  ArrowRight01Icon 
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface Modalidade {
  id: string;
  label: string;
  sub: string;
  color: string;
  icon: string;
  imageSrc: string;
  desc: string;
  shortDesc: string;
  turnos: string;
  faixaEtaria: string;
  requisitos: string[];
  destaques: string[];
}

const MODALIDADES: Modalidade[] = [
  {
    id: "fund2",
    label: "Ensino Fundamental II",
    sub: "6º ao 9º Ano",
    color: "#1a3875",
    icon: "solar:backpack-bold-duotone",
    imageSrc: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    desc: "Formação de base sólida com desenvolvimento do raciocínio lógico, leitura contínua, ciências e integração social saudável.",
    shortDesc: "Formação de base sólida, raciocínio lógico e transição escolar saudável.",
    turnos: "Matutino (07h às 11h25) e Vespertino (13h às 17h25)",
    faixaEtaria: "11 a 14 anos",
    requisitos: [
      "Conclusão do 5º ano do Ensino Fundamental",
      "Histórico Escolar ou Declaração de Transferência da escola de origem",
      "Documentos pessoais do aluno e dos pais ou responsáveis legais",
    ],
    destaques: [
      "Acompanhamento e reforço pedagógico no contraturno",
      "Projetos de leitura e olimpíadas escolares de matemática",
      "Educação física e participação em jogos intercolegiais",
    ],
  },
  {
    id: "medio",
    label: "Ensino Médio Regular",
    sub: "1ª à 3ª Série",
    color: "#1a3875",
    icon: "solar:diploma-bold-duotone",
    imageSrc: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    desc: "Aprofundamento acadêmico de alto nível focado no ENEM, vestibulares de Goiás e preparação para o protagonismo jovem.",
    shortDesc: "Aprofundamento focado no ENEM, vestibulares e protagonismo jovem.",
    turnos: "Matutino (07h às 12h15) e Vespertino (13h às 18h15)",
    faixaEtaria: "15 a 17 anos",
    requisitos: [
      "Certificado de Conclusão do Ensino Fundamental",
      "Histórico Escolar original completo",
      "Título de Eleitor e Reservista (para maiores de 18 anos)",
    ],
    destaques: [
      "Simulados periódicos no modelo oficial do ENEM",
      "Plantões de redação e orientação vocacional contínua",
      "Laboratórios práticos de ciências e informática",
    ],
  },
  {
    id: "tecnico",
    label: "Técnico Integrado",
    sub: "Informática & Administração",
    color: "#0284c7",
    icon: "solar:cpu-bolt-bold-duotone",
    imageSrc: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop",
    desc: "Dupla formação: conclua o Ensino Médio com diploma técnico profissionalizante para rápida inserção no mercado de trabalho.",
    shortDesc: "Diploma técnico profissionalizante em laboratórios de informática modernos.",
    turnos: "Turno Diurno com aulas práticas em contraturno",
    faixaEtaria: "14 a 18 anos",
    requisitos: [
      "Ingresso na 1ª série do Ensino Médio",
      "Conclusão do Ensino Fundamental",
      "Matrícula sujeita à disponibilidade de vagas por turma técnica",
    ],
    destaques: [
      "Aulas em laboratórios de informática com equipamentos modernos",
      "Práticas de gestão administrativa, financeira e digital",
      "Certificação técnica reconhecida pela SEDUC-GO",
    ],
  },
  {
    id: "eja",
    label: "E.J.A. Noturno",
    sub: "Educação de Jovens e Adultos",
    color: "#f59e0b",
    icon: "solar:clock-circle-bold-duotone",
    imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    desc: "Flexibilidade e acolhimento para quem trabalha durante o dia e deseja concluir os estudos com dignidade e apoio dos professores.",
    shortDesc: "Flexibilidade e acolhimento noturno sob medida para quem trabalha.",
    turnos: "Noturno (19h às 22h00)",
    faixaEtaria: "A partir de 15 anos (Fund.) / 18 anos (Médio)",
    requisitos: [
      "Idade mínima legal comprovada por RG",
      "Histórico da última série cursada (ou teste de nivelamento na secretaria)",
      "Comprovante de residência atualizado",
    ],
    destaques: [
      "Aulas modulares e cronograma adaptado a quem trabalha",
      "Professores especializados no acolhimento de adultos",
      "Ambiente seguro e merenda escolar balanceada no período noturno",
    ],
  },
];

export default function MatriculasPage() {
  const [selectedModalidade, setSelectedModalidade] = useState<Modalidade | null>(null);

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 antialiased selection:bg-[#1a3875] selection:text-white">
      {/* ── NAVBAR GLOBAL DO SISTEMA ───────────────────────────── */}
      <PublicNav />

      {/* ── HERO PIXEL-PERFECT (FIEL À IMAGEM 2 COM CONTRASTE) ──── */}
      <section className="bg-[#f8fafc] pt-32 sm:pt-40 lg:pt-44 pb-16 lg:pb-24 border-b border-slate-200/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* ── COLUNA DA ESQUERDA (TEXTO & CHAMADA) ────────────── */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge Azul Escuro Fiel à Imagem */}
              <div className="inline-block bg-[#1a3875] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-2">
                Matrículas Abertas 2026
              </div>

              {/* Título Principal Tipografia Fiel */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#111827] leading-[1.08] tracking-tight">
                Colégio Estadual <br />
                Laurentino Martins: <br />
                tradição, <br />
                excelência e um <br />
                novo espaço para <br />
                o futuro do seu <br />
                filho.
              </h1>

              {/* Subtítulo Parágrafo Fiel */}
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-[48ch] font-normal">
                Com o renomado Sistema Estadual de Ensino de Goiás, estrutura completa no centro da cidade e uma equipe docente altamente qualificada, o Colégio Laurentino Martins prepara estudantes para serem protagonistas em qualquer lugar do mundo.
              </p>

              {/* Grid 2x2 de Diferenciais com Check Circular (Fiel à Imagem) */}
              <div id="diferenciais" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="size-4 rounded-full border border-slate-400 text-slate-700 flex items-center justify-center shrink-0">
                    <HugeIcon icon={Tick01Icon} size={12} strokeWidth={2.5} />
                  </span>
                  <span>Sistema Estadual de Ensino</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-4 rounded-full border border-slate-400 text-slate-700 flex items-center justify-center shrink-0">
                    <HugeIcon icon={Tick01Icon} size={12} strokeWidth={2.5} />
                  </span>
                  <span>Salas amplas e climatizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-4 rounded-full border border-slate-400 text-slate-700 flex items-center justify-center shrink-0">
                    <HugeIcon icon={Tick01Icon} size={12} strokeWidth={2.5} />
                  </span>
                  <span>Apoio pedagógico individualizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-4 rounded-full border border-slate-400 text-slate-700 flex items-center justify-center shrink-0">
                    <HugeIcon icon={Tick01Icon} size={12} strokeWidth={2.5} />
                  </span>
                  <span>Ambiente monitorado e seguro</span>
                </div>
              </div>

              {/* Botões Duplos (Azul Escuro + Amarelo Dourado Fiel à Imagem) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="https://wa.me/5562984152867?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20ao%20Col%C3%A9gio%20Laurentino%20Martins."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#1a3875] hover:bg-[#122854] active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-md transition-all shadow-xs"
                >
                  Quero agendar uma visita
                </a>

                <a
                  href="https://wa.me/5562984152867?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20matr%C3%ADculas%20e%20vagas%20no%20Col%C3%A9gio%20Laurentino%20Martins."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#fbb034] hover:bg-[#f39c12] active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-md transition-all shadow-xs"
                >
                  Falar com a escola no WhatsApp
                </a>
              </div>

            </div>

            {/* ── COLUNA DA DIREITA (FOTO DOS ESTUDANTES COM CARD AMARELO) ─ */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src="/Imagens/matriculas-hero-students.jpg"
                  alt="Estudantes uniformizados do Colégio Estadual Laurentino Martins"
                  width={1024}
                  height={1024}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full h-auto object-cover block"
                />

                {/* Card Amarelo Sobreposto Fiel à Imagem 2 */}
                <div className="absolute bottom-4 right-4 bg-[#fbb034] text-slate-950 px-6 py-4 rounded-xl shadow-lg border border-amber-300/40 text-left">
                  <p className="text-xl sm:text-2xl font-black leading-none tracking-tight">
                    Desde 1978
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    Tradição em educação
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. CARDS DE MODALIDADES COM EFEITO 3D TILTED CARD ────── */}
      <section id="modalidades" className="py-20 bg-[#edf2f7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Modalidades de Ensino Ofertadas
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Conheça as turmas disponíveis e clique em qualquer modalidade para consultar requisitos e horários específicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODALIDADES.map((mod) => (
              <TiltedCard
                key={mod.id}
                imageSrc={mod.imageSrc}
                altText={mod.label}
                captionText={mod.label}
                containerHeight="390px"
                imageHeight="390px"
                containerWidth="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.04}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                onClick={() => setSelectedModalidade(mod)}
                overlayContent={
                  <div className="size-full flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/25 text-white rounded-[20px] select-none border border-white/10 shadow-inner group">
                    {/* Top badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20 shadow-xs">
                        <Icon icon={mod.icon} className="size-3.5" />
                        <span>{mod.sub}</span>
                      </span>
                      <span className="size-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 group-hover:bg-[#fbb034] group-hover:text-slate-950 transition-colors">
                        <HugeIcon icon={ArrowRight01Icon} size={16} />
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="space-y-2 text-left">
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                        {mod.label}
                      </h3>
                      <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2">
                        {mod.shortDesc}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[#fbb034] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        <span>Ver requisitos e turnos</span>
                        <HugeIcon icon={ArrowRight01Icon} size={14} />
                      </div>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL INTERATIVO DE REQUISITOS DA MODALIDADE ─────────── */}
      {selectedModalidade && (
        <Modal
          isOpen
          onClose={() => setSelectedModalidade(null)}
          labelledBy="modalidade-titulo"
          className="max-w-xl bg-white p-6 sm:p-8 space-y-6 border-slate-200 overflow-y-auto"
        >
            {/* Fechar Modal */}
            <button
              onClick={() => setSelectedModalidade(null)}
              className="absolute top-6 right-6 size-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              aria-label="Fechar janela"
            >
              <HugeIcon icon={Cancel01Icon} size={20} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="space-y-2 pr-8">
              <span className="text-xs font-bold text-[#1a3875] uppercase tracking-wider block">
                {selectedModalidade.sub}
              </span>
              <h3 id="modalidade-titulo" className="text-2xl font-black text-slate-900">
                {selectedModalidade.label}
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {selectedModalidade.desc}
              </p>
            </div>

            {/* Ficha Rápida: Turnos e Idade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold">
              <div>
                <span className="text-slate-600 block mb-0.5">Turnos de Aulas:</span>
                <span className="text-slate-900">{selectedModalidade.turnos}</span>
              </div>
              <div>
                <span className="text-slate-600 block mb-0.5">Faixa Etária Recomendada:</span>
                <span className="text-slate-900">{selectedModalidade.faixaEtaria}</span>
              </div>
            </div>

            {/* Requisitos Específicos */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Requisitos para a Vaga
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                {selectedModalidade.requisitos.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <HugeIcon icon={Tick01Icon} size={16} className="text-[#1a3875] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destaques Pedagógicos */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Diferenciais desta Turma
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                {selectedModalidade.destaques.map((dest) => (
                  <li key={dest} className="flex items-start gap-2">
                    <HugeIcon icon={Tick01Icon} size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{dest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botão de Fechar / Ação */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/5562984152867?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20vagas%20para%20a%20turma%20de%20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1a3875] hover:bg-[#122854] text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xs"
              >
                <span>Consultar Vaga no WhatsApp</span>
                <HugeIcon icon={ArrowUpRight01Icon} size={16} />
              </a>
              <button
                onClick={() => setSelectedModalidade(null)}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
              >
                Voltar
              </button>
            </div>
        </Modal>
      )}

      {/* ── BOTÃO FLUTUANTE DE WHATSAPP (FIEL AO BOTÃO AMARELO DA IMAGEM) ── */}
      <a
        href="https://wa.me/5562984152867?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20matr%C3%ADculas%20e%20vagas%20no%20Col%C3%A9gio%20Laurentino%20Martins."
        target="_blank"
        rel="noopener noreferrer"
        title="Fale com a Escola no WhatsApp"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-[#fbb034] hover:bg-[#f39c12] text-slate-950 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-amber-300/40"
        aria-label="Atendimento via WhatsApp"
      >
        <HugeIcon icon={WhatsappIcon} size={28} className="text-slate-950" />
      </a>

      {/* ── RODAPÉ OFICIAL LIQUID GLASS ──────────────────────── */}
      <LiquidGlassFooter />
    </div>
  );
}
