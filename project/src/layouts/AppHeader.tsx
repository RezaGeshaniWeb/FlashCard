'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { APP_NAME } from '@/constants';
import { useUiStore } from '@/store/ui-store';
import { useT } from '@/i18n';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';

export function AppHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const globalSearchOpen = useUiStore((s) => s.globalSearchOpen);
  const setGlobalSearchOpen = useUiStore((s) => s.setGlobalSearchOpen);
  const t = useT();

  const isDark = (resolvedTheme ?? theme) === 'dark';

  return (
    <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={toggleSidebar}
        aria-label={t('nav.openSidebar')}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <p className="truncate text-sm font-semibold text-foreground lg:hidden">
        {APP_NAME}
      </p>

      <div className="ms-auto flex items-center gap-2">
        <div className="hidden w-64 md:block">
          <SearchInput
            readOnly
            placeholder={t('header.searchPlaceholder')}
            aria-label={t('header.openSearch')}
            onFocus={() => setGlobalSearchOpen(true)}
            onClick={() => setGlobalSearchOpen(true)}
          />
        </div>
        <LanguageSwitcher className="hidden sm:inline-flex" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={() => setGlobalSearchOpen(true)}
          aria-label={t('header.openSearch')}
          aria-expanded={globalSearchOpen}
        >
          <Search className="h-5 w-5" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={
            isDark ? t('header.switchToLight') : t('header.switchToDark')
          }
        >
          {isDark ? (
            <Sun className="h-5 w-5" aria-hidden />
          ) : (
            <Moon className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </div>
    </header>
  );
}
