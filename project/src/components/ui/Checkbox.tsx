'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const descId = `${checkboxId}-desc`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-start gap-2.5 text-sm text-foreground',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer',
          )}
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [description ? descId : null, error ? errorId : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={cn(
              'mt-0.5 h-4 w-4 shrink-0 rounded border border-input text-primary accent-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              className,
            )}
            {...props}
          />
          <span className="flex flex-col gap-0.5">
            <span className="font-medium leading-none">{label}</span>
            {description ? (
              <span
                id={descId}
                className="text-xs text-muted-foreground leading-snug"
              >
                {description}
              </span>
            ) : null}
          </span>
        </label>
        {error ? (
          <p id={errorId} className="pl-6 text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
