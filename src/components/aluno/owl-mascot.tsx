/**
 * Duolingo-style owl mascot SVG
 * A friendly, bubbly character for the student area
 */
export function OwlMascot({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <ellipse cx="60" cy="70" rx="40" ry="45" fill="#58CC02" />
      {/* Belly */}
      <ellipse cx="60" cy="78" rx="25" ry="30" fill="#89E219" />
      {/* Left Eye */}
      <circle cx="45" cy="50" r="14" fill="white" />
      <circle cx="47" cy="50" r="7" fill="#4B4B4B" />
      <circle cx="49" cy="48" r="2.5" fill="white" />
      {/* Right Eye */}
      <circle cx="75" cy="50" r="14" fill="white" />
      <circle cx="73" cy="50" r="7" fill="#4B4B4B" />
      <circle cx="75" cy="48" r="2.5" fill="white" />
      {/* Beak */}
      <path d="M55 60 L60 68 L65 60 Z" fill="#FFC800" />
      {/* Left Wing */}
      <ellipse cx="22" cy="72" rx="12" ry="20" fill="#46A302" transform="rotate(-15 22 72)" />
      {/* Right Wing */}
      <ellipse cx="98" cy="72" rx="12" ry="20" fill="#46A302" transform="rotate(15 98 72)" />
      {/* Feet */}
      <ellipse cx="45" cy="110" rx="10" ry="5" fill="#FFC800" />
      <ellipse cx="75" cy="110" rx="10" ry="5" fill="#FFC800" />
      {/* Book in wing (reading theme) */}
      <rect x="86" y="64" width="16" height="20" rx="2" fill="#1CB0F6" />
      <rect x="88" y="66" width="12" height="16" rx="1" fill="white" />
      <line x1="94" y1="68" x2="94" y2="80" stroke="#E5E5E5" strokeWidth="1" />
    </svg>
  );
}

/**
 * Small mascot for top bar / badges
 */
export function OwlMascotSmall({ size = 32, className = "" }: { size?: number; className?: string }) {
  return <OwlMascot size={size} className={className} />;
}
