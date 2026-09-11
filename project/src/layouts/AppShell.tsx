import type { ReactNode } from 'react';
import { GlobalSearch } from '@/features/search/components/GlobalSearch';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <GlobalSearch />
    </div>
  );
}
