'use client';

import { useMemo } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
  round: boolean;
}

const COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#CE82FF', '#FF86D0', '#FF4B4B'];

/** Valor pseudoaleatório determinístico: evita Math.random durante a renderização. */
function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const particles = useMemo<Particle[]>(() => {
    if (!active) return [];

    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: pseudoRandom(i + 1) * 100,
      delay: pseudoRandom(i + 2) * 0.5,
      color: COLORS[Math.floor(pseudoRandom(i + 3) * COLORS.length)],
      size: pseudoRandom(i + 4) * 8 + 4,
      rotation: pseudoRandom(i + 5) * 360,
      round: pseudoRandom(i + 6) > 0.5,
    }));
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-piece absolute"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
