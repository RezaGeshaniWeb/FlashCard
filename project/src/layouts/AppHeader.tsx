'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { APP_NAME } from '@/constants';
import { useUiStore } from '@/store/ui-store';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';

export function AppHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const globalSearchOpen = useUiStore((s) => s.globalSearchOpen);
  const setGlobalSearchOpen = useUiStore((s) => s.setGlobalSearchOpen);

  const isDark = (resolvedTheme ?? theme) === 'dark';

  return (
    <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <p className="truncate text-sm font-semibold text-foreground lg:hidden">
        {APP_NAME}
      </p>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden w-64 md:block">
          <SearchInput
            readOnly
            placeholder="Search… ⌘K"
            aria-label="Open search"
            onFocus={() => setGlobalSearchOpen(true)}
            onClick={() => setGlobalSearchOpen(true)}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={() => setGlobalSearchOpen(true)}
          aria-label="Open search"
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
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
