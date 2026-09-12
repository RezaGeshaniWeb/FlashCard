'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  Settings,
  User,
  X,
  LogOut,
} from 'lucide-react';
import { APP_NAME, ROUTES } from '@/constants';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { useUiStore } from '@/store/ui-store';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: ROUTES.DECKS, labelKey: 'nav.decks', icon: Layers },
  { href: ROUTES.STATISTICS, labelKey: 'nav.statistics', icon: BarChart3 },
  { href: ROUTES.SETTINGS, labelKey: 'nav.settings', icon: Settings },
  { href: ROUTES.PROFILE, labelKey: 'nav.profile', icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const logout = useLogout();
  const t = useT();
  const { dir } = useLocale();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      setSidebarOpen(false);
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch {
      /* toast handled in hook */
    }
  };

  const closedTranslate =
    dir === 'rtl' ? 'translate-x-full' : '-translate-x-full';

  const nav = (
    <nav aria-label={t('nav.mainAria')} className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {t(labelKey)}
          </Link>
        );
      })}
      <div className="mt-auto pt-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => void handleLogout()}
          loading={logout.isPending}
          aria-label={t('nav.signOut')}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          {t('nav.signOut')}
        </Button>
      </div>
    </nav>
  );

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-foreground/40 transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex w-[var(--sidebar-width)] flex-col border-e border-border bg-card transition-transform duration-200 lg:hidden',
          sidebarOpen ? 'translate-x-0' : closedTranslate,
        )}
        aria-label={t('nav.sidebarAria')}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-4">
          <Link
            href={ROUTES.DASHBOARD}
            className="text-base font-semibold text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            {APP_NAME}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('nav.closeSidebar')}
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        {nav}
      </aside>

      <aside
        className="sticky top-0 hidden h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-e border-border bg-card lg:flex"
        aria-label={t('nav.sidebarAria')}
      >
        <div className="flex h-[var(--header-height)] items-center border-b border-border px-4">
          <Link
            href={ROUTES.DASHBOARD}
            className="text-base font-semibold tracking-tight text-primary"
          >
            {APP_NAME}
          </Link>
        </div>
        {nav}
      </aside>
    </>
  );
}
