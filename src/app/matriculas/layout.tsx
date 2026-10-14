import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matrículas 2026',
  description: 'Informações completas sobre o processo de matrículas 2026 no Colégio Estadual Laurentino Martins. Ensino Fundamental, Médio e Técnico.',
};

export default function MatriculasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
