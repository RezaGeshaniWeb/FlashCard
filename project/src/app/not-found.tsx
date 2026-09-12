'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants';
import { useT } from '@/i18n';

export default function NotFound() {
  const t = useT();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {t('errors.notFoundTitle')}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t('errors.notFoundDescription')}
      </p>
      <Link
        href={ROUTES.DASHBOARD}
        className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        {t('errors.backToDashboard')}
      </Link>
    </div>
  );
}
