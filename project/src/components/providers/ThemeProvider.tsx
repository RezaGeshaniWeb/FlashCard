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
import { useServerInsertedHTML } from 'next/navigation';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
}

const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(theme: ThemeMode, systemTheme: 'light' | 'dark') {
  return theme === 'system' ? systemTheme : theme;
}

function applyThemeClass(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}

/**
 * Inline FOUC guard — injected via useServerInsertedHTML (outside the
 * hydrating React tree) so React 19 does not warn about <script> in components.
 */
const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(STORAGE_KEY)};var t=localStorage.getItem(k)||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='dark'||(t!=='light'&&d)?'dark':'light';var e=document.documentElement;e.classList.toggle('dark',r==='dark');e.style.colorScheme=r;}catch(e){}})();`;

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useServerInsertedHTML(() => (
    <script
      id="flashmaster-theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  ));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme;
    const system = getSystemTheme();
    /* eslint-disable react-hooks/set-state-in-effect -- client theme hydrate */
    setSystemTheme(system);
    setThemeState(initial);
    applyThemeClass(resolveTheme(initial, system));
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const nextSystem = media.matches ? 'dark' : 'light';
      setSystemTheme(nextSystem);
      const current =
        (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? defaultTheme;
      if (current === 'system') {
        applyThemeClass(nextSystem);
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [defaultTheme]);

  const setTheme = useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      localStorage.setItem(STORAGE_KEY, next);
      const resolved = resolveTheme(next, getSystemTheme());

      if (disableTransitionOnChange) {
        const root = document.documentElement;
        root.classList.add('[&_*]:!transition-none');
        applyThemeClass(resolved);
        window.setTimeout(() => {
          root.classList.remove('[&_*]:!transition-none');
        }, 1);
        return;
      }

      applyThemeClass(resolved);
    },
    [disableTransitionOnChange],
  );

  const resolvedTheme = resolveTheme(theme, systemTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: mounted ? theme : defaultTheme,
      setTheme,
      resolvedTheme: mounted ? resolvedTheme : 'light',
      systemTheme,
    }),
    [mounted, theme, defaultTheme, setTheme, resolvedTheme, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
