'use client';

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      type = 'text',
      showPasswordToggle = false,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const [visible, setVisible] = useState(false);

    const isPassword = type === 'password' || showPasswordToggle;
    const resolvedType = isPassword && visible ? 'text' : isPassword ? 'password' : type;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required ? (
              <span className="ml-0.5 text-danger" aria-hidden>
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger focus-visible:ring-danger',
              isPassword && 'pr-10',
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setVisible((v) => !v)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
        {hint && !error ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
