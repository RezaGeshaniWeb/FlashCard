'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';
import { settingsService } from '@/features/settings/services/settings-service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  decks: () => [...dashboardKeys.all, 'decks'] as const,
  settings: () => [...dashboardKeys.all, 'settings'] as const,
};

export function useDashboard() {
  const statsQuery = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats(),
  });

  const decksQuery = useQuery({
    queryKey: dashboardKeys.decks(),
    queryFn: () => dashboardService.getRecentDecks(),
  });

  const settingsQuery = useQuery({
    queryKey: dashboardKeys.settings(),
    queryFn: () => settingsService.get(),
  });

  const isLoading =
    statsQuery.isLoading || decksQuery.isLoading || settingsQuery.isLoading;
  const isError =
    statsQuery.isError || decksQuery.isError || settingsQuery.isError;

  const refetch = () => {
    void statsQuery.refetch();
    void decksQuery.refetch();
    void settingsQuery.refetch();
  };

  return {
    stats: statsQuery.data,
    decks: decksQuery.data ?? [],
    settings: settingsQuery.data,
    isLoading,
    isError,
    error:
      statsQuery.error ?? decksQuery.error ?? settingsQuery.error ?? null,
    refetch,
  };
}
