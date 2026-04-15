import Image from "next/image";

export const AdminLogo = () => {
  return (
    <div className="flex items-center justify-start gap-2 py-2 relative z-20">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center">
        <Image
          src="/logo/LaurentãoLogoB.svg"
          alt="Logo"
          width={80}
          height={80}
          priority
          className="h-16 w-16 shrink-0"
        />
      </div>
      <span className="font-bold text-2xl whitespace-pre text-white">
        Biblioteca
      </span>
    </div>
  );
};

export const AdminLogoIcon = () => {
  return (
    <div className="flex items-center justify-center py-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            <Image
                src="/logo/LaurentãoLogoB.svg"
                alt="Logo"
                width={60}
                height={60}
                priority
                className="h-12 w-12 shrink-0"
            />
        </div>
    </div>
  );
};
