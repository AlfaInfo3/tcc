import type { Metadata } from "next";
import { Poppins, Quicksand } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Colégio Estadual Laurentino Martins | Portal e Acervo Escolar",
    template: "%s | Colégio Laurentino Martins",
  },
  description: "Portal oficial e biblioteca digital do Colégio Estadual Laurentino Martins em Goianésia - GO. Catálogo de livros, reservas online, matrículas e informações escolares.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Colégio Estadual Laurentino Martins",
    description: "Portal oficial e biblioteca digital do Colégio Estadual Laurentino Martins.",
    siteName: "Colégio Estadual Laurentino Martins",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${poppins.variable} ${quicksand.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
