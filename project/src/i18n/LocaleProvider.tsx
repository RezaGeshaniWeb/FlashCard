'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getDictionary, resolveLocale, type Messages } from './dictionaries';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  localeDir,
  type Locale,
} from './types';
import { getMessage, interpolate } from './utils';

type TranslateParams = Record<string, string | number>;

export type TranslateFn = (key: string, params?: TranslateParams) => string;

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  if (match) {
    return resolveLocale(decodeURIComponent(match.split('=')[1] ?? ''));
  }
  try {
    return resolveLocale(localStorage.getItem(LOCALE_COOKIE));
  } catch {
    return DEFAULT_LOCALE;
  }
}

function persistLocale(locale: Locale) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}; samesite=lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* ignore */
  }
}

function applyDocumentLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = localeDir(locale);
  root.dataset.locale = locale;
}

export interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== locale) {
      setLocaleState(stored);
    }
    applyDocumentLocale(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate from cookie once
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
    applyDocumentLocale(next);
  }, []);

  const messages = useMemo(() => getDictionary(locale), [locale]);

  const t = useCallback<TranslateFn>(
    (key, params) => {
      const value = getMessage(messages as unknown as Record<string, unknown>, key);
      if (!value) return key;
      return interpolate(value, params);
    },
    [messages],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: localeDir(locale),
      messages,
      setLocale,
      t,
    }),
    [locale, messages, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
