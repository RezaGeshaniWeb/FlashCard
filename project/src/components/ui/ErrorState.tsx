import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  icon,
  retryLabel = 'Try again',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-danger/30 bg-danger-muted/40 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
        {icon ?? <AlertTriangle className="h-6 w-6" aria-hidden />}
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-2"
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
