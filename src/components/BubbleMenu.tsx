"use client";

import Link from "next/link";
import { useState } from "react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface BubbleMenuItem {
  label: string;
  href: string;
  rotation?: number;
  hoverStyles?: { bgColor: string; textColor: string };
}

interface BubbleMenuProps {
  logo?: React.ReactNode;
  items: BubbleMenuItem[];
  menuBg?: string;
  menuContentColor?: string;
  animationDuration?: number;
  className?: string;
}

export default function BubbleMenu({ logo, items, menuBg = "#ffffff", menuContentColor = "#1e3a8a", className = "" }: BubbleMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ backgroundColor: menuBg, color: menuContentColor }}
        className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border border-slate-200 font-semibold transition-all hover:shadow-xl cursor-pointer"
        aria-label="Menu"
      >
        {logo}
        {open ? <HugeIcon icon={Cancel01Icon} size={16} /> : <HugeIcon icon={Menu01Icon} size={16} />}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{ backgroundColor: menuBg }}
          className="absolute right-0 mt-2 min-w-[200px] rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ color: menuContentColor }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
