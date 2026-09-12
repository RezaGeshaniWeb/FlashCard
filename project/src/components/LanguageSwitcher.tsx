'use client';

import { useLocale, useT, type Locale } from '@/i18n';
import { cn } from '@/utils/cn';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();

  const options: { value: Locale; label: string }[] = [
    { value: 'en', label: t('settings.langEn') },
    { value: 'fa', label: t('settings.langFa') },
  ];

  return (
    <div
      className={cn('inline-flex items-center gap-1 rounded-md border border-border p-0.5', className)}
      role="group"
      aria-label={t('settings.language')}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLocale(opt.value)}
          className={cn(
            'rounded px-2.5 py-1 text-xs font-medium transition-colors',
            locale === opt.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
          aria-pressed={locale === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
