import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const radiusMap = {
  sm: "rounded-l-none rounded-r-[3px]",
  md: "rounded-l-none rounded-r-[4px]",
  lg: "rounded-l-none rounded-r-[5px]",
};

const sizeConfig = {
  sm: { 
    width: "135px", 
    thickness: 20, 
    halfThickness: 10, 
    pagesWidth: 18, 
    pagesLeft: "calc(100% - 14px)",
    spineLeft: "-10px",
  },
  md: { 
    width: "160px", 
    thickness: 24, 
    halfThickness: 12, 
    pagesWidth: 22, 
    pagesLeft: "calc(100% - 16px)",
    spineLeft: "-12px",
  },
  lg: { 
    width: "220px", 
    thickness: 30, 
    halfThickness: 15, 
    pagesWidth: 28, 
    pagesLeft: "calc(100% - 20px)",
    spineLeft: "-15px",
  },
};

const colorMap = {
  slate: { from: "from-slate-900", to: "to-slate-700" },
  gray: { from: "from-gray-900", to: "to-gray-700" },
  zinc: { from: "from-zinc-900", to: "to-zinc-700" },
  neutral: { from: "from-neutral-900", to: "to-neutral-700" },
  stone: { from: "from-stone-900", to: "to-stone-700" },
  red: { from: "from-red-900", to: "to-red-700" },
  orange: { from: "from-orange-900", to: "to-orange-700" },
  amber: { from: "from-amber-900", to: "to-amber-700" },
  yellow: { from: "from-yellow-900", to: "to-yellow-700" },
  lime: { from: "from-lime-900", to: "to-lime-700" },
  green: { from: "from-green-900", to: "to-green-700" },
  emerald: { from: "from-emerald-900", to: "to-emerald-700" },
  teal: { from: "from-teal-900", to: "to-teal-700" },
  cyan: { from: "from-cyan-900", to: "to-cyan-700" },
  sky: { from: "from-sky-900", to: "to-sky-700" },
  blue: { from: "from-blue-900", to: "to-blue-700" },
  indigo: { from: "from-indigo-900", to: "to-indigo-700" },
  violet: { from: "from-violet-900", to: "to-violet-700" },
  purple: { from: "from-purple-900", to: "to-purple-700" },
  fuchsia: { from: "from-fuchsia-900", to: "to-fuchsia-700" },
  pink: { from: "from-pink-900", to: "to-pink-700" },
  rose: { from: "from-rose-900", to: "to-rose-700" },
};

interface BookProps {
  radius?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg";
  color?: keyof typeof colorMap;
  isStatic?: boolean;
  className?: string;
  children?: ReactNode;
  coverImage?: string; // Added to support existing usage
  forceRotate?: boolean;
}

export const ModernBookCover = ({
  radius = "sm",
  size = "md",
  color = "zinc",
  isStatic = false,
  className = "",
  children,
  coverImage,
  forceRotate = false,
}: BookProps) => {
  const gradient = colorMap[color] || colorMap.zinc;
  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      className={cn(
        `z-20 group [perspective:900px] w-min select-none`,
        className
      )}
    >
      <div
        style={{
          width: cfg.width,
          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          transformOrigin: "center center",
        }}
        className={`relative [transform-style:preserve-3d] ${
          isStatic || forceRotate
            ? "[transform:rotateY(-28deg)]"
            : "[transform:rotateY(0deg)] group-hover:[transform:rotateY(-28deg)] group-hover/card:[transform:rotateY(-28deg)] group-active:[transform:rotateY(-28deg)] group-focus-within:[transform:rotateY(-28deg)]"
        } aspect-3/4 ${radiusMap[radius]}`}
      >
        {/* 1. FRONT COVER */}
        <div
          className={cn(
            "absolute inset-0 size-full text-white flex flex-col justify-end p-5 overflow-hidden",
            `bg-gradient-to-tr ${gradient.from} ${gradient.to}`,
            radiusMap[radius]
          )}
          style={{
            transform: `translateZ(${cfg.halfThickness}px)`,
            boxShadow: "0 10px 24px -4px rgba(0, 0, 0, 0.55), 0 4px 6px -2px rgba(0, 0, 0, 0.35)",
          }}
        >
          {coverImage ? (
            <div className="absolute inset-0 z-1">
              <Image
                src={coverImage}
                alt="Capa do livro"
                fill
                sizes="(max-width: 768px) 40vw, 160px"
                unoptimized
                className="object-fill rounded-[inherit]"
              />
              {/* Realistic Spine Hinge / Crease along left edge */}
              <div 
                className="absolute inset-y-0 left-0 w-3 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.08) 35%, rgba(255,255,255,0.12) 60%, transparent 100%)",
                }}
              />
              {/* Soft lighting depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          ) : (
            <>
              <div
                className="absolute left-0 top-0 h-full w-full z-0"
                style={{
                  minWidth: "8.2%",
                  background:
                    "linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)",
                  opacity: 0.2,
                }}
              />
              <div className="relative z-10 pl-1">{children}</div>
            </>
          )}
        </div>

        {/* 2. LEFT SPINE (LOMBADA) - Closes left hinge in 3D */}
        <div
          className="absolute inset-y-0 select-none pointer-events-none"
          style={{
            left: cfg.spineLeft,
            width: `${cfg.thickness}px`,
            transform: "rotateY(-90deg)",
            transformOrigin: "center center",
            background: "linear-gradient(90deg, #090e1a 0%, #1e293b 50%, #090e1a 100%)",
          }}
        />

        {/* 3. RIGHT PAGES BLOCK (MIOLO DE PÁGINAS) - Recessed authentic paper block */}
        <div
          className="absolute select-none pointer-events-none overflow-hidden"
          style={{
            top: "3px",
            bottom: "3px",
            width: `${cfg.pagesWidth}px`,
            left: cfg.pagesLeft,
            transform: "rotateY(90deg)",
            transformOrigin: "center center",
            background: "repeating-linear-gradient(to bottom, #fcf9f2 0px, #fcf9f2 1.5px, #ebe3d3 1.5px, #ebe3d3 3px)",
            boxShadow: "inset 2px 0 4px rgba(0,0,0,0.18), inset -2px 0 4px rgba(0,0,0,0.18)",
            borderRadius: "1px",
          }}
        />

        {/* 4. BACK COVER (CONTRACAPA) - Solid backing matching the book */}
        <div
          className={cn(
            "absolute inset-0 size-full text-white flex flex-col justify-end p-5 overflow-hidden",
            `bg-gradient-to-tr ${gradient.from} ${gradient.to}`,
            radiusMap[radius]
          )}
          style={{
            transform: `translateZ(-${cfg.halfThickness}px)`,
            boxShadow: "-12px 10px 24px rgba(0, 0, 0, 0.65)",
          }}
        />
      </div>
    </div>
  );
};

interface BookHeaderProps {
  children: ReactNode;
  className?: string;
}

export const BookHeader = ({ children, className = "" }: BookHeaderProps) => (
  <div className={cn("flex gap-2 flex-wrap", className)}>{children}</div>
);

interface BookTitleProps {
  children: ReactNode;
  className?: string;
}

export const BookTitle = ({ children, className = "" }: BookTitleProps) => (
  <h1 className={cn("font-bold select-none mt-3 mb-1 text-balance text-lg", className)}>
    {children}
  </h1>
);

interface BookDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const BookDescription = ({
  children,
  className = "",
}: BookDescriptionProps) => (
  <p className={cn("opacity-80 select-none text-xs/relaxed line-clamp-4", className)}>
    {children}
  </p>
);

export default ModernBookCover;
