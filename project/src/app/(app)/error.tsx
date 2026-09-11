'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center"
    >
      <h1 className="text-2xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <Button type="button" onClick={reset} aria-label="Try again">
        Try again
      </Button>
    </div>
  );
}
