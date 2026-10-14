'use client';

import { StarIcon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';

interface StarsProps {
  rating: number; // 0 to 5
  size?: number;
}

export function Stars({ rating, size = 16 }: StarsProps) {
  const percentage = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <div className="relative inline-flex items-center" style={{ width: size * 5 + 8, height: size }}>
      {/* Background Gray Stars */}
      <div className="flex items-center gap-0.5 text-[#E0CECE]">
        {[...Array(5)].map((_, i) => (
          <HugeIcon key={i} icon={StarIcon} size={size} className="[&_path]:fill-current stroke-none" />
        ))}
      </div>

      {/* Foreground Amber Stars (Clipped) */}
      <div 
        className="absolute top-0 left-0 flex items-center gap-0.5 overflow-hidden text-[#F59E0B]"
        style={{ width: `${percentage}%` }}
      >
        {[...Array(5)].map((_, i) => (
          <HugeIcon key={i} icon={StarIcon} size={size} className="[&_path]:fill-current stroke-none" />
        ))}
      </div>
    </div>
  );
}
