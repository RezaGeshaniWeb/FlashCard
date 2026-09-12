'use client';

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useT } from '@/i18n';
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
  title,
  description,
  icon,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps) {
  const t = useT();

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
        <h3 className="text-base font-semibold text-foreground">
          {title ?? t('errors.somethingWrong')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description ?? t('errors.unexpectedRetry')}
        </p>
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-2"
        >
          {retryLabel ?? t('common.tryAgain')}
        </Button>
      ) : null}
    </div>
  );
}
