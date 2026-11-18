export default function Loading() {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-[#060F33] via-[#0B1B5C] to-[#040924] p-3 sm:p-4 md:p-6 font-['Quicksand',sans-serif]">
      <div className="mx-auto flex max-w-[1720px] items-start gap-4 lg:gap-5">
        <div className="hidden h-[70vh] w-[76px] shrink-0 animate-pulse rounded-[28px] bg-white/10 md:block" />
        <div className="hidden h-[70vh] w-[220px] shrink-0 animate-pulse rounded-[28px] bg-white/10 lg:block" />

        <div className="min-w-0 flex-1">
          <div className="mb-4 h-14 animate-pulse rounded-2xl bg-white/10" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="h-[220px] w-full max-w-[160px] animate-pulse rounded-r-xl rounded-l-sm bg-white/15" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden h-[70vh] w-[54px] shrink-0 animate-pulse rounded-[28px] bg-white/10 lg:block" />
      </div>
    </div>
  );
}
