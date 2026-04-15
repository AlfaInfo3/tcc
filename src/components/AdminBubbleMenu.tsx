"use client";

import { Icon } from "@iconify/react";
import BubbleMenu from "@/components/BubbleMenu";

const adminItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Livros',
    href: '/admin/livros',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Reservas',
    href: '/admin/reservas',
    rotation: -8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'Alunos',
    href: '/admin/alunos',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'Empréstimos',
    href: '/admin/emprestimos',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  },
  {
    label: 'Usuários',
    href: '/admin/users',
    rotation: 8,
    hoverStyles: { bgColor: '#06b6d4', textColor: '#ffffff' }
  },
  {
    label: 'Sair',
    href: '/admin/auth',
    rotation: -8,
    hoverStyles: { bgColor: '#111827', textColor: '#ffffff' }
  }
];

export function AdminBubbleMenu() {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6 md:bottom-auto">
      <div className="w-full max-w-6xl px-4 flex justify-center md:justify-end">
        <BubbleMenu 
          logo={
            <div className="flex items-center gap-2 p-2">
               <Icon icon="solar:library-bold" className="size-6 text-[#1e40af]" />
               <span className="text-lg font-black tracking-tight text-slate-800 hidden sm:inline-block">
                 Admin
               </span>
            </div>
          }
          items={adminItems}
          menuBg="#ffffff"
          menuContentColor="#1e3a8a"
          animationDuration={0.5}
          className="pointer-events-auto"
        />
      </div>
    </div>
  );
}
