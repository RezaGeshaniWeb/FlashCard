'use client';

import { Loader } from '@/components/ui/Loader';
import { useT } from '@/i18n';

export function AuthFormLoader() {
  const t = useT();
  return <Loader label={t('auth.loadingForm')} />;
}
