'use client';

import { useStatistics } from '../hooks/useStatistics';
import { StatsOverview } from './StatsOverview';
import { ActivityChart } from './ActivityChart';
import { AccuracyChart } from './AccuracyChart';
import { Heatmap } from './Heatmap';
import { StreakCard } from './StreakCard';
import { AchievementsList } from './AchievementsList';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useT } from '@/i18n';

export function StatisticsView() {
  const t = useT();
  const { stats, activity, isLoading, isError, refetch } = useStatistics();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <ErrorState title={t('statistics.loadErrorTitle')} onRetry={refetch} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('statistics.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('statistics.subtitle')}
        </p>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityChart activity={activity} />
        <AccuracyChart activity={activity} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Heatmap activity={activity} />
        </div>
        <div className="flex flex-col gap-4">
          <StreakCard
            streak={stats.studyStreak}
            totalReviews={stats.totalReviews}
          />
          <AchievementsList stats={stats} />
        </div>
      </div>
    </div>
  );
}
