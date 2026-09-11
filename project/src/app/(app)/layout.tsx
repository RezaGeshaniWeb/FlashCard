import type { ReactNode } from 'react';
import { AppShell } from '@/layouts/AppShell';

export default function AppGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
