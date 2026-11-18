'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
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

const MENU_WIDTH = 160;
const MENU_ITEM_HEIGHT = 36;
const MENU_PADDING = 8;
const VIEWPORT_MARGIN = 8;

export const TableActions = ({ actions }: TableActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = actions.length * MENU_ITEM_HEIGHT + MENU_PADDING;

    let top = rect.bottom + 4;
    if (top + menuHeight > window.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, rect.top - menuHeight - 4);
    }

    let left = rect.right - MENU_WIDTH;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN));

    setCoords({ top, left });
  }, [actions.length]);

  // Reposition while open and follow page scrolling.
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!actions || actions.length === 0) {
    return null;
  }

  const menu = (
    <AnimatePresence>
      {isOpen && coords && (
        <motion.div
          ref={menuRef}
          role="menu"
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.1 }}
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: MENU_WIDTH }}
          className="z-[9999] flex flex-col overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          {actions.map((action, index) => {
            const content = (
              <>
                {action.icon}
                <span>{action.label}</span>
              </>
            );

            const className = `flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
              action.variant === 'destructive'
                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-popover-foreground hover:bg-muted'
            }`;

            if (action.href) {
              return (
                <Link
                  key={index}
                  role="menuitem"
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
                role="menuitem"
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
  );

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Abrir ações"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
        className="rounded-md p-1 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring"
      >
        <HugeIcon icon={MoreHorizontalIcon} size={20} />
      </button>

      {typeof document !== 'undefined' && createPortal(menu, document.body)}
    </div>
  );
};
