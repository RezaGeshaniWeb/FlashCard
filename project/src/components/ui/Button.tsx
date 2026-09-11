'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import {
  buttonVariants,
  type ButtonVariantProps,
} from '@/components/ui/button-variants';
import { cn } from '@/utils/cn';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  loading?: boolean;
  'aria-label'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isIcon = size === 'icon';
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        {...props}
      >
        {loading ? (
          <Loader2
            className={cn('animate-spin', isIcon ? 'h-4 w-4' : 'h-4 w-4')}
            aria-hidden
          />
        ) : null}
        {loading && isIcon ? (
          <span className="sr-only">Loading</span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
