'use client';

import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/stats-service';

export const statisticsKeys = {
  all: ['statistics'] as const,
  stats: () => [...statisticsKeys.all, 'stats'] as const,
  activity: () => [...statisticsKeys.all, 'activity'] as const,
};

export function useStatistics() {
  const statsQuery = useQuery({
    queryKey: statisticsKeys.stats(),
    queryFn: () => statsService.getStats(),
  });

  const activityQuery = useQuery({
    queryKey: statisticsKeys.activity(),
    queryFn: () => statsService.getActivity(),
  });

  const isLoading = statsQuery.isLoading || activityQuery.isLoading;
  const isError = statsQuery.isError || activityQuery.isError;

  return {
    stats: statsQuery.data,
    activity: activityQuery.data ?? statsQuery.data?.dailyActivity ?? [],
    isLoading,
    isError,
    error: statsQuery.error ?? activityQuery.error ?? null,
    refetch: () => {
      void statsQuery.refetch();
      void activityQuery.refetch();
    },
  };
}
