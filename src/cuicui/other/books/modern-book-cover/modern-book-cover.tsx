import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const radiusMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
};

const sizeMap = {
  sm: { width: "140px", spineTranslation: "122px" },
  md: { width: "160px", spineTranslation: "142px" },
  lg: { width: "220px", spineTranslation: "202px" },
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

  return (
    <div
      className={cn(
        `z-20 group [perspective:800px] w-min [--shadowColor:#bbb] dark:[--shadowColor:#111]`,
        className
      )}
    >
      <div
        style={{
          width: sizeMap[size].width,
          transition: "transform 400ms ease",
        }}
        className={`relative [transform-style:preserve-3d] ${
          isStatic || forceRotate
            ? "[transform:rotateY(-30deg)]"
            : "[transform:rotateY(0deg)] group-hover:[transform:rotateY(-30deg)] group-active:[transform:rotateY(-30deg)] group-focus-within:[transform:rotateY(-30deg)]"
        } aspect-3/4 ${radiusMap[radius]}`}
      >
        {/* Front Side */}
        <div
          className={cn(
            "absolute inset-y-0 overflow-hidden size-full left-0 text-white flex flex-col justify-end p-6",
            `bg-linear-to-tr ${gradient.from} ${gradient.to}`,
            radiusMap[radius]
          )}
          style={{
            transform: "translateZ(25px)",
            boxShadow: "5px 5px 20px var(--shadowColor)",
            border: "1px solid rgba(255,255,255,0.1)" // Rebarba fix
          }}
        >
            {coverImage ? (
                <div className="absolute inset-0 z-1">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-fill rounded-[inherit]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20" />
                </div>
            ) : (
                <>
                  <div
                    className="absolute left-0 top-0 h-full w-full z-0"
                    style={{
                      minWidth: "8.2%", // Match user code
                      background:
                        "linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)",
                      opacity: 0.2,
                    }}
                  />
                  <div className="relative z-10 pl-1">{children}</div>
                </>
            )}
        </div>

        {/* Spine */}
        <div
          className="absolute right-31 bg-white"
          style={{
            top: "3px",
            bottom: "3px",
            width: "48px",
            transform: `translateX(${sizeMap[size].spineTranslation}) rotateY(90deg)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,1) 50%, rgba(249,249,249,1) 50%)",
          }}
        />

        {/* Back Side */}
        <div
          className={cn(
             "absolute inset-y-0 overflow-hidden size-full left-0 text-white flex flex-col justify-end p-6",
             `bg-linear-to-tr ${gradient.from} ${gradient.to}`,
             radiusMap[radius]
          )}
          style={{
            transform: "translateZ(-25px)",
            boxShadow: "-10px 0 50px 10px var(--shadowColor)",
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
