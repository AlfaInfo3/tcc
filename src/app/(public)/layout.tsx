"use client";

import Footer from "@/components/books/footer";
import { PublicNav } from "@/components/PublicNav";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLivros = pathname.startsWith("/livros");

  if (isLivros) {
    return <>{children}</>;
  }

  return (
    <div>
      <PublicNav />
      <main>
        {children}
      </main>
      <footer className="flex-1">
        <Footer />
      </footer>
    </div>
  );
}
