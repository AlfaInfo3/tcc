"use client";

import CardNav from "@/components/CardNav";

const publicItems = [
  {
    label: "A Escola",
    bgColor: "#1e40af",
    textColor: "#ffffff",
    links: [
      { label: "Página Inicial", href: "/", ariaLabel: "Home" },
      { label: "O Colégio", href: "/sobre", ariaLabel: "Sobre Nós" },
    ]
  },
  {
    label: "Explore",
    bgColor: "#EF476F",
    textColor: "#ffffff",
    links: [
      { label: "Ensino", href: "/#ensino", ariaLabel: "Ensino" },
      { label: "Turmas", href: "/#turmas", ariaLabel: "Turmas" },
      { label: "Matrículas", href: "/matriculas", ariaLabel: "Matrículas" }
    ]
  },
  {
    label: "Acesso",
    bgColor: "#FFD166",
    textColor: "#451a03",
    links: [
      { label: "Catálogo de Livros", href: "/livros", ariaLabel: "Catálogo de Livros" },
      { label: "Contato", href: "/contato", ariaLabel: "Fale Conosco" }
    ]
  }
];

export function PublicNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="w-full h-full relative pointer-events-auto">
        <CardNav 
          logo={
            <div className="flex items-center justify-center p-2">
               <img src="/logo/laurentao-logo.svg" alt="Logo Laurentino" className="h-14 md:h-16 w-auto" />
             </div>
          }
          items={publicItems}
          baseColor="#ffffff"
          menuColor="#1e3a8a"
          buttonBgColor="#FFD166"
          buttonTextColor="#451a03"
        />
      </div>
    </div>
  );
}
