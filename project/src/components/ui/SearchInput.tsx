'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      label = 'Search',
      id,
      value,
      onClear,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasValue = String(value ?? '').length > 0;

    return (
      <div className="relative w-full">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={ref}
          id={inputId}
          type="search"
          value={value}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-card py-2 pr-9 pl-9 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '[&::-webkit-search-cancel-button]:hidden',
            className,
          )}
          {...props}
        />
        {hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
