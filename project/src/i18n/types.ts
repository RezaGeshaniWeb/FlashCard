export const LOCALES = ['en', 'fa'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'flashmaster_locale';

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'fa';
}

export function localeDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}
