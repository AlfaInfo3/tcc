'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Location01Icon,
  CallIcon,
  InstagramIcon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';

interface LiquidGlassFooterProps {
  onNavigate?: (sectionId: string) => void;
}

export function LiquidGlassFooter({ onNavigate }: LiquidGlassFooterProps) {
  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="contato" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 2xl:px-12 min-[1800px]:px-16 bg-white overflow-hidden border-t border-slate-100">
      {/* Ambient background glows suaves */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 size-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* ── CARD WRAPPER ───────────────────────────────────────── */}
      <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1536px] min-[1800px]:max-w-[1720px] mx-auto rounded-[38px] sm:rounded-[44px] 2xl:rounded-[48px] p-[1.5px] bg-gradient-to-b from-blue-100 via-slate-200/60 to-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.07)]">

        {/* ── INNER WHITE CONTAINER ──────────────────────────────── */}
        <div
          className="rounded-[36px] sm:rounded-[42px] 2xl:rounded-[46px] bg-white p-7 sm:p-12 lg:p-14 2xl:p-16 text-slate-800 border border-slate-100/80 shadow-xs"
        >
          {/* TOP ROW: BRAND & FORM + NAVIGATION COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 2xl:gap-16 pb-12 border-b border-slate-100">

            {/* Col 1: Brand & Newsletter Form (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="size-12 sm:size-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shadow-xs overflow-hidden p-1.5 shrink-0">
                  <Image
                    src="/logo/laurentao-logo.svg"
                    alt="Logo do Colégio Estadual Laurentino Martins"
                    width={56}
                    height={56}
                    className="size-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-tight">
                    Laurentino Martins
                  </h3>
                  <p className="text-xs font-bold text-blue-700 tracking-wide uppercase">
                    Colégio Estadual • SEDUC-GO
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-md 2xl:max-w-xl">
                Educação pública de excelência em Goianésia-GO. Nosso compromisso é formar cidadãos conscientes e preparados para o futuro.
              </p>
            </div>

            {/* Col 2: Navigation Columns (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">

              {/* Links Rápidos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                  Navegação
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                  <li>
                    <Link href="/sobre" className="hover:text-blue-700 transition-colors">
                      Sobre o Colégio
                    </Link>
                  </li>
                  <li>
                    <a href="#ensino" onClick={(e) => handleLinkClick('ensino', e)} className="hover:text-blue-700 transition-colors cursor-pointer">
                      Nossos Diferenciais
                    </a>
                  </li>
                  <li>
                    <a href="#turmas" onClick={(e) => handleLinkClick('turmas', e)} className="hover:text-blue-700 transition-colors cursor-pointer">
                      Explore as Turmas
                    </a>
                  </li>
                  <li>
                    <Link href="/livros" className="hover:text-blue-700 transition-colors">
                      Acervo & Biblioteca
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Níveis de Ensino */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                  Modalidades
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-600" />
                    <span>Fundamental II</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-600" />
                    <span>Ensino Médio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-600" />
                    <span>Téc. Profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-600" />
                    <span>E.J.A. Noturno</span>
                  </li>
                </ul>
              </div>

              {/* Contato & Localização */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                  Atendimento
                </h4>
                <ul className="space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <HugeIcon icon={Location01Icon} size={16} className="text-blue-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      R. 36, N 391 &mdash; São Cristóvão<br />Goianésia &mdash; GO, 76380-000
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <HugeIcon icon={CallIcon} size={16} className="text-blue-700 shrink-0" />
                    <a href="tel:62984152867" className="hover:text-blue-700 transition-colors">
                      (62) 9 8415-2867
                    </a>
                  </li>
                  <li className="text-[11px] text-slate-600 pt-1">
                    Horário: Seg a Sex &bull; 07h às 22h
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* BOTTOM ROW: COPYRIGHT & SOCIAL BUTTONS */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-600">
            <div className="text-center sm:text-left">
              <p>&copy; {new Date().getFullYear()} Colégio Estadual Laurentino Martins. Todos os direitos reservados.</p>
              <p className="text-[11px] text-slate-600 mt-1">Lema: &ldquo;Educar para construir&rdquo; &bull; SEDUC-GO</p>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/colestaduallaurentinomartins/?hl=pt"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram oficial"
                className="size-10 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-700 transition-all hover:scale-105 shadow-2xs"
              >
                <HugeIcon icon={InstagramIcon} size={16} />
              </a>

              <a
                href="https://wa.me/5562984152867"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp da secretaria"
                className="px-3.5 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 text-emerald-800 transition-all hover:scale-105 shadow-2xs text-xs font-semibold"
              >
                <HugeIcon icon={WhatsappIcon} size={16} className="text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default LiquidGlassFooter;
