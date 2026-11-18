'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Extra classes applied to the dialog panel. */
  className?: string;
  /** Extra classes applied to the overlay. */
  overlayClassName?: string;
  /** Id of the element that labels the dialog (for screen readers). */
  labelledBy?: string;
}

/**
 * Accessible modal primitive.
 *
 * - Renders through a portal so it is never clipped by table/list overflow.
 * - Closes on Escape and on backdrop click.
 * - Locks body scroll while open and restores focus to the trigger on close.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  labelledBy,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-4',
        overlayClassName
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-2xl outline-none',
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
