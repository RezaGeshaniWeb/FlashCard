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
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.DECKS, label: 'Decks', icon: Layers },
  { href: ROUTES.STATISTICS, label: 'Statistics', icon: BarChart3 },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
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

  const nav = (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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
            {label}
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
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          Sign out
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
          'fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r border-border bg-card transition-transform duration-200 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
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
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        {nav}
      </aside>

      <aside
        className="sticky top-0 hidden h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-card lg:flex"
        aria-label="Sidebar"
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
