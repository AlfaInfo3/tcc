import { Icon } from "@iconify/react";
import { PublicNav } from "@/components/PublicNav";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Contato | Colégio Estadual Laurentino Martins",
  description:
    "Entre em contato com o Colégio Estadual Laurentino Martins. Endereço, telefone e redes sociais.",
};

const contacts = [
  {
    icon: "solar:map-point-bold-duotone",
    label: "Endereço",
    value: "R. 36, N 391 — São Cristóvão, Goinésia — GO",
    color: "#1e40af",
    bg: "bg-blue-50",
  },
  {
    icon: "solar:phone-bold-duotone",
    label: "Telefone",
    value: "(62) 9 8415-2867",
    color: "#EF476F",
    bg: "bg-rose-50",
  },
  {
    icon: "fa-brands:instagram",
    label: "Instagram",
    value: "@colestaduallaurentinomartins",
    href: "https://www.instagram.com/colestaduallaurentinomartins",
    color: "#E1306C",
    bg: "bg-pink-50",
  },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNav />

      {/* HERO */}
      <section className="relative pt-40 pb-28 text-white overflow-hidden bg-[#EF476F]">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-50 to-transparent z-10" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-2xl">
          <Badge className="mb-6 px-4 py-2 text-sm font-bold bg-white/15 text-white border-white/20 rounded-full">
            Fale Conosco
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">
            Entre em <span className="text-[#FFD166]">Contato</span>
          </h1>
          <p className="text-xl text-red-100 font-medium">
            Estamos sempre disponíveis para ouvir você.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            {contacts.map((c) => (
              <div
                key={c.label}
                className="rounded-3xl bg-white border border-slate-100 p-8 flex flex-col gap-5 shadow-sm hover:shadow-lg transition-shadow text-center items-center"
              >
                <div
                  className={`size-16 rounded-2xl ${c.bg} flex items-center justify-center`}
                >
                  <Icon icon={c.icon} className="size-8" style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-black text-slate-800 hover:text-[#EF476F] transition-colors break-all"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-lg font-black text-slate-800">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MAP EMBED */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 h-80">
            <iframe
              title="Localização do Colégio"
              src="https://www.google.com/maps?q=R.+36,+N+391,+São+Cristóvão,+Goinésia,+GO&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#1e40af] py-8 text-blue-200 text-center text-sm font-medium">
        <p>© 2026 Colégio Estadual Laurentino Martins · Goinésia-GO</p>
      </footer>
    </div>
  );
}
