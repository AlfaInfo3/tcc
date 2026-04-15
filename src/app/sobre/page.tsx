import { Icon } from "@iconify/react";
import { PublicNav } from "@/components/PublicNav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Sobre Nós | Colégio Estadual Laurentino Martins",
  description:
    "Conheça a história e a missão do Colégio Estadual Laurentino Martins, escola pública estadual de referência em Goinésia-GO.",
};

const values = [
  {
    icon: "solar:book-bold-duotone",
    color: "#1e40af",
    bg: "bg-blue-50",
    title: "Excelência Acadêmica",
    desc: "Compromisso com o aprendizado de qualidade, preparando alunos para os melhores desafios.",
  },
  {
    icon: "solar:users-group-rounded-bold-duotone",
    color: "#EF476F",
    bg: "bg-rose-50",
    title: "Comunidade Escolar",
    desc: "Um ambiente acolhedor que une alunos, professores e famílias em torno da educação.",
  },
  {
    icon: "solar:star-bold-duotone",
    color: "#FFD166",
    bg: "bg-amber-50",
    title: "Formação Integral",
    desc: "Desenvolvemos não apenas o conhecimento, mas o caráter e os valores de cada estudante.",
  },
  {
    icon: "solar:leaf-bold-duotone",
    color: "#06b6d4",
    bg: "bg-cyan-50",
    title: "Responsabilidade Social",
    desc: "Formamos cidadãos conscientes, preparados para contribuir com uma sociedade mais justa.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNav />

      {/* HERO */}
      <section className="relative pt-40 pb-28 text-white overflow-hidden bg-[#1e40af]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-50 to-transparent z-10" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-3xl">
          <Badge className="mb-6 px-4 py-2 text-sm font-bold bg-white/15 text-white border-white/20 rounded-full">
            Nossa História
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Colégio <span className="text-[#FFD166]">Laurentino Martins</span>
          </h1>
          <p className="text-xl text-blue-100 font-medium leading-relaxed">
            Escola pública estadual localizada em Goinésia-GO, com a missão de{" "}
            <em className="font-bold text-white">"Educar para construir"</em>.
          </p>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <Badge className="px-4 py-2 text-sm font-bold bg-[#1e40af]/10 text-[#1e40af] border-none rounded-full">
                Missão e Visão
              </Badge>
              <h2 className="text-4xl font-black text-slate-800 leading-tight">
                Quem Somos
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                O Colégio Estadual Laurentino Martins é uma instituição de ensino público do
                Estado de Goiás, localizada em Goinésia. Oferecemos educação de qualidade do
                Ensino Fundamental II ao Ensino Médio, além de curso Técnico Profissional e EJA.
              </p>
              <p className="text-slate-500 font-medium leading-relaxed">
                Nossa missão sempre foi transformar a realidade dos nossos alunos por meio da
                educação. Acreditamos que cada estudante tem potencial ilimitado, e nossa escola
                é o espaço perfeito para desenvolvê-lo.
              </p>
              <Link
                href="/livros"
                className="inline-flex items-center gap-2 bg-[#1e40af] text-white font-bold px-6 py-3 rounded-full hover:bg-blue-800 transition-colors"
              >
                <Icon icon="solar:book-bookmark-bold" className="size-5" />
                Ver Acervo da Biblioteca
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <img
                src="https://www.rvcfm.com.br/images/2025/11/20251113173318_l_WhatsAppImage2025-11-13at14.15.401.jpg"
                alt="Colégio Laurentino Martins"
                className="rounded-3xl shadow-xl object-cover h-64 col-span-2"
              />
              <img
                src="/Imagens/f2.jpg"
                alt="Sala de aula"
                className="rounded-3xl shadow-md object-cover h-40"
              />
              <img
                src="/Imagens/em.png"
                alt="Alunos"
                className="rounded-3xl shadow-md object-cover h-40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <Badge className="px-4 py-2 text-sm font-bold bg-[#EF476F]/10 text-[#EF476F] border-none rounded-full">
              Nossos Valores
            </Badge>
            <h2 className="text-4xl font-black text-slate-800">
              O que nos move
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`size-14 rounded-2xl ${v.bg} flex items-center justify-center`}
                >
                  <Icon icon={v.icon} className="size-7" style={{ color: v.color }} />
                </div>
                <h3 className="text-lg font-black text-slate-800">{v.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLES */}
      <footer className="bg-[#1e40af] py-8 text-blue-200 text-center text-sm font-medium">
        <p>© 2026 Colégio Estadual Laurentino Martins · Goinésia-GO</p>
      </footer>
    </div>
  );
}
