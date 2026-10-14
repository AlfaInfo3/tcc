import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canais de Atendimento | Colégio Estadual Laurentino Martins',
  description:
    'Estamos à disposição para tirar suas dúvidas, orientar nossa comunidade e oferecer o suporte que você precisa no Colégio Estadual Laurentino Martins.',
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
