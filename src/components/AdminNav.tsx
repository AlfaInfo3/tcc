"use client";

import { Icon } from "@iconify/react";
import CardNav from "@/components/CardNav";

const adminItems = [
  {
    label: "Geral",
    bgColor: "#1e40af",
    textColor: "#ffffff",
    links: [
      { label: "Dashboard", href: "/admin/dashboard", ariaLabel: "Ir para Dashboard" },
      { label: "Usuários", href: "/admin/users", ariaLabel: "Gerenciar Usuários" },
      { label: "Sair", href: "/admin/auth", ariaLabel: "Sair do Sistema" }
    ]
  },
  {
    label: "Acervo",
    bgColor: "#FFD166",
    textColor: "#451a03",
    links: [
      { label: "Livros", href: "/admin/livros", ariaLabel: "Gerenciar Livros" },
      { label: "Reservas", href: "/admin/reservas", ariaLabel: "Gerenciar Reservas" }
    ]
  },
  {
    label: "Acadêmico",
    bgColor: "#EF476F",
    textColor: "#ffffff",
    links: [
      { label: "Alunos", href: "/admin/alunos", ariaLabel: "Gerenciar Alunos" },
      { label: "Empréstimos", href: "/admin/emprestimos", ariaLabel: "Gerenciar Empréstimos" }
    ]
  }
];

import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();

  if (pathname === '/admin/auth') return null;

  return (
    <CardNav 
      logo={
        <div className="flex items-center gap-2 text-[#1e40af]">
          <Icon icon="solar:library-bold" className="size-6" />
          <span className="text-xl font-black tracking-tight hidden sm:inline-block">Admin</span>
        </div>
      }
      items={adminItems}
      baseColor="#ffffff"
      menuColor="#1e3a8a"
      buttonBgColor="#FFD166"
      buttonTextColor="#451a03"
    />
  );
}
