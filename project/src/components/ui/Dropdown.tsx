'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown components must be used within Dropdown');
  return ctx;
}

export interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, menuId }}>
      <div ref={rootRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function DropdownTrigger({
  children,
  className,
  'aria-label': ariaLabel,
}: DropdownTriggerProps) {
  const { open, setOpen, triggerId, menuId } = useDropdown();

  return (
    <button
      type="button"
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      onClick={() => setOpen(!open)}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'end';
}

export function DropdownMenu({
  children,
  className,
  align = 'start',
}: DropdownMenuProps) {
  const { open, menuId, triggerId } = useDropdown();
  if (!open) return null;

  return (
    <div
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      className={cn(
        'absolute z-50 mt-1 min-w-44 rounded-lg border border-border bg-card p-1 shadow-md animate-scale-in',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
  danger?: boolean;
}

export function DropdownItem({
  children,
  onSelect,
  className,
  disabled,
  danger,
}: DropdownItemProps) {
  const { setOpen } = useDropdown();

  const handle = useCallback(() => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  }, [disabled, onSelect, setOpen]);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handle}
      className={cn(
        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
        'focus-visible:outline-none focus-visible:bg-muted',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'hover:bg-muted',
        danger ? 'text-danger' : 'text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
