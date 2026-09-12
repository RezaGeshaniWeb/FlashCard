'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/i18n';

export interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center"
    >
      <h1 className="text-2xl font-semibold text-foreground">
        {t('errors.somethingWrong')}
      </h1>
      <p className="text-sm text-muted-foreground">
        {error.message || t('errors.unexpected')}
      </p>
      <Button type="button" onClick={reset} aria-label={t('common.tryAgain')}>
        {t('common.tryAgain')}
      </Button>
    </div>
  );
}
