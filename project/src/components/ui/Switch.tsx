'use client';

import { forwardRef, useId, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      onCheckedChange,
      label,
      description,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;
    const labelId = `${switchId}-label`;
    const descId = `${switchId}-desc`;

    return (
      <div className="inline-flex items-start gap-3">
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={description ? descId : undefined}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-primary' : 'bg-muted',
            className,
          )}
          {...props}
        >
          <span
            aria-hidden
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-card shadow-sm transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </button>
        {label || description ? (
          <div className="flex flex-col gap-0.5">
            {label ? (
              <label
                id={labelId}
                htmlFor={switchId}
                className={cn(
                  'text-sm font-medium text-foreground',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
              >
                {label}
              </label>
            ) : null}
            {description ? (
              <p id={descId} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

Switch.displayName = 'Switch';
