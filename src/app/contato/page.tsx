'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { LiquidGlassFooter } from '@/components/LiquidGlassFooter';
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Location01Icon,
  CallIcon,
  InstagramIcon,
  Maximize01Icon,
  Navigation01Icon,
  Clock01Icon,
  UserGroupIcon,
  File01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Quais documentos são necessários para a matrícula?',
    answer:
      'Para efetivação da matrícula, é necessário apresentar: Certidão de Nascimento ou RG/CPF do aluno, RG e CPF dos pais ou responsáveis legais, comprovante de residência recente (água ou energia), histórico escolar original ou declaração de transferência e cartão de vacinação atualizado.',
  },
  {
    question: 'Qual o horário de funcionamento da secretaria?',
    answer:
      'A Secretaria do Colégio Laurentino Martins funciona de segunda a sexta-feira, das 7h às 17h, de forma ininterrupta para atendimento ao público, emissão de documentos e matrículas.',
  },
  {
    question: 'Como faço para saber sobre as vagas disponíveis?',
    answer:
      'As vagas para novas matrículas e transferências são disponibilizadas pelo sistema oficial da SEDUC Goiás. Você também pode consultar diretamente a secretaria escolar presencialmente ou pelo nosso WhatsApp oficial (62) 98415-2867.',
  },
  {
    question: 'Existe transporte escolar?',
    answer:
      'Sim, a escola é atendida por linhas de transporte público regulares do município e conta com atendimento de rotas de transporte escolar conveniadas conforme as diretrizes da rede estadual.',
  },
  {
    question: 'Como entrar em contato com a coordenação?',
    answer:
      'O contato com a coordenação pedagógica pode ser realizado pelo telefone (62) 98415-2867 ou presencialmente na sala da coordenação durante os turnos matutino e vespertino.',
  },
];

export default function ContatoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* =========================================================================
          1. NAVBAR GLOBAL (CardNav com logo e links padrão do sistema)
          ========================================================================= */}
      <PublicNav />

      {/* =========================================================================
          2. HERO SECTION COM FOTO DA FACHADA DA ESCOLA
          ========================================================================= */}
      <section className="bg-[#0B2545] text-white pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Lado Esquerdo: Textos & Título */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">

              {/* Badge "FALE CONOSCO" */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07192F] border border-blue-400/30 text-white text-xs font-bold uppercase tracking-wider shadow-inner">
                <span className="text-[#FFD166] font-black text-sm">FALE CONOSCO</span>
              </div>

              {/* Título Principal */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-tight leading-[1.08] text-white">
                Canais de
                <span className="block text-[#FFD166]">Atendimento</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal pt-1">
                Estamos à disposição para tirar suas dúvidas, orientar nossa comunidade e oferecer o suporte que você precisa.
              </p>
            </div>

            {/* Lado Direito: Fotografia da Fachada Laurentino Martins */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-blue-950/40 aspect-[4/3] sm:aspect-[16/11] max-w-lg mx-auto lg:max-w-none">
                <img
                  src="/Imagens/fachada-laurentino.jpg"
                  alt="Fachada do Colégio Estadual Laurentino Martins"
                  className="w-full h-full object-cover object-center saturate-[1.1] hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CARDS DE CONTATO SUPERIORES (3 CARDS EM GRADE)
          ========================================================================= */}
      <section className="-mt-10 sm:-mt-14 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Endereço */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <HugeIcon icon={Location01Icon} size={24} className="text-blue-600" />
                  </div>
                  <div className="size-7 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
                    <HugeIcon icon={ArrowUpRight01Icon} size={14} />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">Endereço</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  R. 36, Nº 391 – São Cristóvão
                  <br />
                  Goianésia – GO, 76381-152
                </p>
              </div>

              <div className="pt-6 flex justify-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Col%C3%A9gio+Estadual+Laurentino+Martins,+R.+36,+391+-+S%C3%A3o+Crist%C3%B3v%C3%A3o,+Goian%C3%A9sia+-+GO,+76381-152"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-blue-200 hover:border-blue-400 hover:bg-blue-50/60 text-blue-600 text-xs font-semibold transition-all"
                >
                  <span>Ver no mapa</span>
                  <HugeIcon icon={ArrowRight01Icon} size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Telefone */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                    <HugeIcon icon={CallIcon} size={24} className="text-pink-500" />
                  </div>
                  <div className="size-7 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center group-hover:border-pink-300 group-hover:text-pink-500 transition-colors">
                    <HugeIcon icon={ArrowUpRight01Icon} size={14} />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">Telefone</h3>
                <p className="font-extrabold text-slate-900 text-sm sm:text-base mb-1">
                  (62) 98415-2867
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Segunda a sexta
                  <br />
                  7h às 17h
                </p>
              </div>

              <div className="pt-6 flex justify-center">
                <a
                  href="tel:62984152867"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-blue-200 hover:border-blue-400 hover:bg-blue-50/60 text-blue-600 text-xs font-semibold transition-all"
                >
                  <HugeIcon icon={CallIcon} size={13} className="text-blue-600" />
                  <span>Ligar agora</span>
                  <HugeIcon icon={ArrowRight01Icon} size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Instagram */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <HugeIcon icon={InstagramIcon} size={24} className="text-white" />
                  </div>
                  <div className="size-7 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center group-hover:border-rose-300 group-hover:text-rose-500 transition-colors">
                    <HugeIcon icon={ArrowUpRight01Icon} size={14} />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">Instagram</h3>
                <a
                  href="https://www.instagram.com/colestaduallaurentinomartins/?hl=pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-700 text-xs sm:text-sm block mb-1 transition-colors break-all"
                >
                  @colestaduallaurentinomartins
                </a>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Acompanhe nossas novidades,
                  <br />
                  projetos e eventos.
                </p>
              </div>

              <div className="pt-6 flex justify-center">
                <a
                  href="https://www.instagram.com/colestaduallaurentinomartins/?hl=pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-blue-200 hover:border-blue-400 hover:bg-blue-50/60 text-blue-600 text-xs font-semibold transition-all"
                >
                  <HugeIcon icon={InstagramIcon} size={13} className="text-blue-600" />
                  <span>Acessar perfil</span>
                  <HugeIcon icon={ArrowRight01Icon} size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SEÇÃO DO MAPA & "VENHA NOS VISITAR!"
          ========================================================================= */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

              {/* Lado Esquerdo: Visualização do Mapa */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden relative border border-slate-200/90 h-[340px] sm:h-[400px] w-full bg-slate-100 shadow-inner group">

                  {/* Botão Superior Esquerdo "Ampliar mapa" */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Col%C3%A9gio+Estadual+Laurentino+Martins,+R.+36,+391+-+S%C3%A3o+Crist%C3%B3v%C3%A3o,+Goian%C3%A9sia+-+GO,+76381-152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 z-20 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <HugeIcon icon={Maximize01Icon} size={13} className="text-slate-600" />
                    <span>Ampliar mapa</span>
                  </a>

                  {/* Google Maps Iframe */}
                  <iframe
                    title="Mapa Colégio Estadual Laurentino Martins"
                    src="https://maps.google.com/maps?q=Col%C3%A9gio%20Estadual%20Laurentino%20Martins%20Goianesia%20GO&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 filter contrast-[1.03]"
                    loading="lazy"
                  />

                  {/* Watermark Google no canto inferior */}
                  <div className="absolute bottom-2 left-3 z-10 pointer-events-none opacity-80">
                    <span className="text-[11px] font-bold tracking-tight text-slate-500 bg-white/80 px-2 py-0.5 rounded shadow-xs">
                      Google
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Informações de Visita */}
              <div className="lg:col-span-5 space-y-6 text-left">

                {/* Bloco 1: Venha nos visitar */}
                <div className="space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <HugeIcon icon={Location01Icon} size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Venha nos visitar!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Nossa escola está localizada no bairro São Cristóvão, em Goianésia. Confira o endereço e trace sua rota.
                  </p>
                </div>

                {/* Bloco 2: Endereço Detalhado */}
                <div className="space-y-2 pt-1">
                  <div className="size-10 rounded-full border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
                    <HugeIcon icon={Navigation01Icon} size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Endereço</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    R. 36, Nº 391 – São Cristóvão
                    <br />
                    Goianésia – GO, 76381-152
                  </p>
                </div>

                {/* Botão de Ação: Como chegar */}
                <div className="pt-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Col%C3%A9gio+Estadual+Laurentino+Martins,+R.+36,+391+-+S%C3%A3o+Crist%C3%B3v%C3%A3o,+Goian%C3%A9sia+-+GO,+76381-152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <HugeIcon icon={Navigation01Icon} size={16} className="text-white" />
                    <span>Como chegar</span>
                    <HugeIcon icon={ArrowRight01Icon} size={16} />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FAIXA HORIZONTAL DE INFORMAÇÕES RÁPIDAS (4 COLUNAS EM AZUL CLARO)
          ========================================================================= */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0F6FF] rounded-2xl p-6 sm:p-8 border border-blue-100/90 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">

              {/* Col 1: Horário de Atendimento */}
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <HugeIcon icon={Clock01Icon} size={20} className="text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Horário de atendimento
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Segunda a sexta
                    <br />
                    7h às 17h
                  </p>
                </div>
              </div>

              {/* Col 2: Secretaria */}
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <HugeIcon icon={UserGroupIcon} size={20} className="text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Secretaria
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Atendimento ao público, matrículas e informações gerais.
                  </p>
                </div>
              </div>

              {/* Col 3: Setores */}
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <HugeIcon icon={File01Icon} size={20} className="text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Setores
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direção, Coordenação, Secretaria e Biblioteca.
                  </p>
                </div>
              </div>

              {/* Col 4: Fale pelo WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <HugeIcon icon={WhatsappIcon} size={20} className="text-blue-700" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Fale pelo WhatsApp
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tire suas dúvidas de forma rápida e prática.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/5562984152867?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Col%C3%A9gio%20Laurentino%20Martins."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all"
                  >
                    <HugeIcon icon={WhatsappIcon} size={14} className="text-blue-600" />
                    <span>Iniciar conversa</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SEÇÃO DE PERGUNTAS FREQUENTES (FAQ) COM DOODLE DO AVIÃOZINHO
          ========================================================================= */}
      <section className="py-14 sm:py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start relative">

            {/* Lado Esquerdo: Chamada para Dúvidas & Doodle Avião */}
            <div className="lg:col-span-5 space-y-4 text-left relative">

              {/* Badge Amarela */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD166] text-slate-900 text-xs font-black uppercase tracking-wider shadow-xs">
                <span>DÚVIDAS FREQUENTES</span>
              </div>

              {/* Título Principal da Seção */}
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight leading-tight">
                Ainda tem <span className="text-[#0B2545]">dúvidas?</span>
              </h2>

              {/* Descrição */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md font-normal">
                Acesse nossa seção de perguntas frequentes e encontre a resposta para as principais questões sobre matrícula, documentos e funcionamento da escola.
              </p>

              {/* Botão de Ação */}
              <div className="pt-2">
                <a
                  href="#faq-list"
                  className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#123868] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Ver perguntas frequentes</span>
                  <HugeIcon icon={ArrowRight01Icon} size={16} />
                </a>
              </div>

              {/* Ilustração Doodle do Avião de Papel com Rastro Pontilhado */}
              <div className="hidden lg:block absolute -bottom-16 right-0 w-48 h-32 pointer-events-none opacity-85">
                <svg
                  viewBox="0 0 200 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-blue-300"
                >
                  {/* Trilha Curva Pontilhada */}
                  <path
                    d="M 10 90 C 40 100, 60 70, 75 80 C 95 95, 110 50, 150 40"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  {/* Ícone do Avião de Papel */}
                  <g transform="translate(145, 20) rotate(15) scale(0.85)">
                    <path
                      d="M2 12L22 2L15 22L11 13L2 12Z"
                      stroke="#93C5FD"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#EFF6FF"
                    />
                    <path
                      d="M22 2L11 13"
                      stroke="#93C5FD"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>

            </div>

            {/* Lado Direito: Lista de Perguntas (Acordeão Interativo) */}
            <div id="faq-list" className="lg:col-span-7 space-y-3">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={item.question}
                    className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-blue-200 transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-blue-700 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="leading-snug">{item.question}</span>
                      <HugeIcon
                        icon={ArrowRight01Icon}
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-blue-600' : ''
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50 animate-in fade-in-50 duration-200">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Global Liquid Glass Footer */}
      <LiquidGlassFooter />

    </div>
  );
}
