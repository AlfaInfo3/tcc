import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center px-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD166]/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-8">
        {/* Icon / Visual */}
        <div className="size-28 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-[#1e40af] shadow-lg border border-blue-100">
          <Icon icon="solar:ghost-bold-duotone" className="size-14" />
        </div>

        {/* 404 Number */}
        <div className="space-y-3">
          <h1 className="text-[8rem] sm:text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-900 drop-shadow-sm select-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            A página que você está procurando não existe ou foi removida. Volte à página inicial ou explore nosso catálogo de livros.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild className="bg-[#FFD166] hover:bg-[#FFC132] text-slate-900 font-bold px-8 py-6 text-base rounded-full shadow-lg hover:scale-105 transition-transform">
            <Link href="/">
              Voltar ao Início
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-8 py-6 text-base rounded-full border-2 border-slate-200 shadow-lg transition-all">
            <Link href="/livros">
              Ver Catálogo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
