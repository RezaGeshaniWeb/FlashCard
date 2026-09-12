'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LocaleProvider, useLocale } from '@/i18n';

export interface AppProvidersProps {
  children: ReactNode;
}

function AppToaster() {
  const { dir } = useLocale();
  return (
    <Toaster
      position={dir === 'rtl' ? 'top-left' : 'top-right'}
      dir={dir}
      richColors
      closeButton
      toastOptions={{
        className: 'font-sans',
      }}
    />
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ThemeProvider defaultTheme="system" disableTransitionOnChange={false}>
          {children}
          <AppToaster />
        </ThemeProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
