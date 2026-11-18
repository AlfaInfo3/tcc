import Image from "next/image"
import Link from "next/link"

interface BookCardHorizontalProps {
    book: {
        id: string | number;
        title: string;
        author: string;
        coverUrl?: string;
        quantity: number;
    }
}

export function BookCardHorizontal({ book }: BookCardHorizontalProps) {
    const isAvailable = book.quantity > 0;

  return (
    <div
      className="
        group relative
        min-w-[130px] w-[130px] h-[190px]
        card-duo
        overflow-hidden
        flex-shrink-0
        hover:scale-105 transition-transform duration-200
        active:scale-95
      "
    >
      {/* Capa */}
      <div className="absolute inset-x-0 inset-y-0 h-full">
          {book.coverUrl ? (
            <Image
                src={book.coverUrl}
                alt={`Capa de ${book.title}`}
                fill
                sizes="130px"
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-2 text-center">
                 <span className="text-[10px] font-bold">Sem capa</span>
             </div>
          )}
      </div>

      {/* Gradiente Overlay para leitura do texto */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-slate-900/90
          via-slate-900/50
          to-transparent
          opacity-80
          group-hover:opacity-90
          transition-opacity
        "
      />

      {/* Linha/Borda superior decorativa extra para dar o efeito 3d se a imagem encostar na borda */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/10 pointer-events-none z-10" />

      {/* Status */}
      <div className="absolute top-2 left-2 z-20">
        <span
            className={`
            text-[9px] font-black px-2 py-1 rounded-full shadow-sm uppercase tracking-wider
            ${isAvailable ? 'bg-primary text-white border border-primary-dark/50' : 'bg-red-500 text-white border border-red-700/50'}
            `}
        >
            {isAvailable ? 'Disp.' : 'Indisp.'}
        </span>
      </div>

      {/* Conteúdo (Sempre Visível no Mobile, Hover no Desktop - Estilo Duolingo) */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          p-3
          z-20
          flex flex-col justify-end
          translate-y-2 lg:translate-y-8
          opacity-100 lg:opacity-0
          transition-all
          duration-300
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <h3 className="text-xs font-black text-white line-clamp-2 leading-tight drop-shadow-md mb-1">
          {book.title}
        </h3>
        <p className="text-[10px] text-white/80 font-bold line-clamp-1 mb-2 drop-shadow-sm">{book.author}</p>

        <Link href={`/livros/${book.id}`} className="block w-full" aria-label={`Ver ${book.title}`}>
            <button
              className="
                  btn-duo
                  w-full
                  py-2
                  text-[11px]
                  bg-[#FFD166] text-[#0f172a]
                  cursor-pointer
                  flex items-center justify-center
                  shadow-md
              "
            >
              Ver Detalhes
            </button>
        </Link>
      </div>
      
      {/* Clickable Area for whole card */}
      <Link href={`/livros/${book.id}`} className="absolute inset-0 z-0" aria-label={`Ver ${book.title}`} />
    </div>
  )
}
