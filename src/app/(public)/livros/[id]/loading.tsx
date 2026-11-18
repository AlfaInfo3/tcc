export default function Loading() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#060F33] via-[#0B1B5C] to-[#040924] px-4 pb-24 pt-8 sm:px-6 sm:pt-12 lg:px-12 font-['Quicksand',sans-serif]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-white/10" />
        <div className="rounded-[32px] border border-white/10 bg-white/95 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
            <div className="md:col-span-5 lg:col-span-4">
              <div className="mx-auto aspect-[2/3] w-full max-w-[270px] animate-pulse rounded-2xl bg-slate-200" />
            </div>
            <div className="space-y-4 md:col-span-7 lg:col-span-8">
              <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
              <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
