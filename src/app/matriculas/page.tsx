import { Icon } from "@iconify/react";
import { PublicNav } from "@/components/PublicNav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Matrículas | Colégio Estadual Laurentino Martins",
  description:
    "Saiba como realizar a matrícula no Colégio Estadual Laurentino Martins. Documentos necessários e calendário de inscrições.",
};

const steps = [
  {
    num: "01",
    icon: "solar:document-bold-duotone",
    title: "Separe os documentos",
    desc: "Reúna os documentos necessários: RG/CPF do aluno e responsável, comprovante de residência e histórico escolar.",
  },
  {
    num: "02",
    icon: "solar:map-point-school-bold-duotone",
    title: "Compareça à escola",
    desc: "Dirija-se à Secretaria do Colégio Laurentino Martins no horário de atendimento: segunda a sexta, das 7h às 17h.",
  },
  {
    num: "03",
    icon: "solar:pen-bold-duotone",
    title: "Preencha o formulário",
    desc: "Preencha o formulário de matrícula com os dados do aluno e responsável legal.",
  },
  {
    num: "04",
    icon: "solar:check-circle-bold-duotone",
    title: "Matrícula confirmada!",
    desc: "Aguarde a confirmação da matrícula. Você receberá informações sobre o início das aulas.",
  },
];

const courses = [
  { label: "Fundamental II", sub: "6º ao 9º ano", color: "#1e40af", icon: "solar:backpack-bold" },
  { label: "Ensino Médio", sub: "1ª a 3ª série", color: "#EF476F", icon: "solar:microscope-bold" },
  { label: "Téc. Profissional", sub: "Integrado ao Médio", color: "#06b6d4", icon: "solar:cpu-bolt-bold" },
  { label: "EJA", sub: "Jovens e Adultos", color: "#f59e0b", icon: "solar:diploma-bold" },
];

export default function MatriculasPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNav />

      {/* HERO */}
      <section className="relative pt-40 pb-28 text-white overflow-hidden bg-[#1e40af]">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-50 to-transparent z-10" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-2xl">
          <Badge className="mb-6 px-4 py-2 text-sm font-bold bg-white/15 text-white border-white/20 rounded-full">
            Inscreva-se
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">
            Faça sua <span className="text-[#FFD166]">Matrícula</span>
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Comece sua jornada de aprendizado no Colégio Laurentino Martins.
          </p>
        </div>
      </section>

      {/* CURSOS DISPONÍVEIS */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-12 space-y-3">
            <Badge className="px-4 py-2 text-sm font-bold bg-[#1e40af]/10 text-[#1e40af] border-none rounded-full">
              Modalidades
            </Badge>
            <h2 className="text-3xl font-black text-slate-800">Cursos Disponíveis</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {courses.map((c) => (
              <div
                key={c.label}
                className="rounded-3xl bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon icon={c.icon} className="size-10" style={{ color: c.color }} />
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{c.label}</h3>
                  <p className="text-slate-500 text-sm font-medium">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* STEPS */}
          <div className="text-center mb-12 space-y-3">
            <Badge className="px-4 py-2 text-sm font-bold bg-[#EF476F]/10 text-[#EF476F] border-none rounded-full">
              Passo a Passo
            </Badge>
            <h2 className="text-3xl font-black text-slate-800">Como fazer a matrícula</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-3xl bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 text-5xl font-black text-slate-100 select-none">
                  {s.num}
                </span>
                <Icon icon={s.icon} className="size-9 text-[#1e40af]" />
                <h3 className="font-black text-slate-800 text-base">{s.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-slate-500 font-medium mb-4">Dúvidas? Entre em contato conosco.</p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-[#1e40af] text-white font-bold px-8 py-4 rounded-full hover:bg-blue-800 transition-colors shadow-lg"
            >
              <Icon icon="solar:phone-bold" className="size-5" />
              Falar com a Secretaria
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1e40af] py-8 text-blue-200 text-center text-sm font-medium">
        <p>© 2026 Colégio Estadual Laurentino Martins · Goinésia-GO</p>
      </footer>
    </div>
  );
}
