import type { ReactNode } from 'react';
import { Layers } from 'lucide-react';

import { APP_NAME } from '@/constants';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_color-mix(in_srgb,var(--primary)_18%,transparent)_0%,_transparent_50%)]"
        aria-hidden
      />
      <div className="relative z-10 flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md"
            aria-hidden
          >
            <Layers className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {APP_NAME}
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Spaced-repetition flashcards to master anything faster.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/90 p-6 shadow-md backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
