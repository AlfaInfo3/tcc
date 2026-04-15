'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface Action {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
}

interface TableActionsProps {
  actions: Action[];
}

export const TableActions = ({ actions }: TableActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
           e.stopPropagation(); // Prevent row click if any
           setIsOpen(!isOpen);
        }}
        className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <MoreHorizontal size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-40 z-[9999] bg-popover border border-border rounded-lg shadow-lg overflow-hidden flex flex-col p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action, index) => {
              const content = (
                <>
                  {action.icon}
                  <span>{action.label}</span>
                </>
              );

              const className = `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left ${
                action.variant === 'destructive'
                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-popover-foreground hover:bg-muted'
              }`;

              if (action.href) {
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className={className}
                    onClick={() => setIsOpen(false)}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
