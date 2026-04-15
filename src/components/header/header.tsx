"use client";

import { usePathname } from "next/navigation";
import StaggeredMenu from "../StaggeredMenu";

export default function Header() {
  const pathname = usePathname();
  // Activate transparent header on book catalog and details pages: /livros and /livros/[id]
  const isBookPage = pathname?.startsWith('/livros');

  return (
    <header className="z-50 fixed lg:relative w-full top-0 left-0 pointer-events-auto">
      <StaggeredMenu
        isFixed
        menuButtonColor="#00008B"
        openMenuButtonColor="#00008B"
        accentColor="#00008B"
        colors={['#cce3f0', '#4682B4', '#00008B']}
        logoUrl="/logo/LaurentãoLogo.svg"
        headerClassName="pointer-events-auto"
        transparentHeader={isBookPage}
        items={[
          { label: 'Home', link: '/', ariaLabel: 'Ir para a página inicial' },
          { label: 'Livros', link: '/livros', ariaLabel: 'Ver catálogo de livros' },

        ]}
      />
    </header>
  );
}