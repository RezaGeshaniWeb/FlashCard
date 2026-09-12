'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { buttonVariants } from '@/components/ui/button-variants';
import { APP_NAME, ROUTES } from '@/constants';
import { useT } from '@/i18n';
import { cn } from '@/utils/cn';

export function LandingHero() {
  const t = useT();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,_var(--secondary)_0%,_transparent_50%),radial-gradient(ellipse_at_80%_80%,_color-mix(in_srgb,var(--primary)_22%,transparent)_0%,_transparent_55%)]"
        aria-hidden
      />
      <div className="relative z-10 flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-scale-in">
          <Layers className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl animate-fade-in">
          {APP_NAME}
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground animate-fade-in">
          {t('landing.tagline')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
          <Link
            href={ROUTES.LOGIN}
            className={cn(buttonVariants({ size: 'lg' }), 'min-w-36')}
          >
            {t('landing.signIn')}
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'min-w-36',
            )}
          >
            {t('landing.createAccount')}
          </Link>
        </div>
      </main>
    </div>
  );
}
