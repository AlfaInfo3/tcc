'use client';

interface AlphaRailProps {
  availableLetters: Set<string>;
  activeLetter?: string;
  onLetterClick: (letter: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function AlphaRail({ availableLetters, activeLetter, onLetterClick }: AlphaRailProps) {
  return (
    <aside className="w-[26px] shrink-0 bg-white/95 backdrop-blur-md rounded-full py-3.5 px-0.5 flex flex-col items-center justify-between shadow-xl border border-white/30 select-none text-[10px] font-bold text-slate-600 sticky top-4 h-[calc(100vh-32px)]">
      {ALPHABET.map((letter) => {
        const isAvailable = availableLetters.has(letter);
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            type="button"
            disabled={!isAvailable}
            onClick={() => isAvailable && onLetterClick(letter)}
            className={`size-[20px] flex items-center justify-center rounded-full transition-all leading-none ${
              isActive
                ? 'bg-blue-600 text-white font-black scale-110 shadow-sm'
                : isAvailable
                ? 'hover:bg-blue-100 text-blue-900 cursor-pointer font-bold'
                : 'opacity-20 cursor-default'
            }`}
          >
            {letter}
          </button>
        );
      })}
    </aside>
  );
}
