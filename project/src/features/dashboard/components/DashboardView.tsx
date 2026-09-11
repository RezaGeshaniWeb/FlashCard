'use client';

import { useDashboard } from '../hooks/useDashboard';
import { TodayReviewsWidget } from './TodayReviewsWidget';
import { StudyStreakWidget } from './StudyStreakWidget';
import { AccuracyWidget } from './AccuracyWidget';
import { WeeklyGoalWidget } from './WeeklyGoalWidget';
import { RecentDecksWidget } from './RecentDecksWidget';
import { RecentActivityWidget } from './RecentActivityWidget';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardView() {
  const { stats, decks, settings, isLoading, isError, refetch } =
    useDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-full" label="Loading widget" />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <ErrorState
        title="Could not load dashboard"
        description="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  const firstDueDeck = decks.find((d) => d.dueCount > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your reviews, streak, and recent progress at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TodayReviewsWidget
          dueCount={stats.cardsDueToday}
          firstDeckId={firstDueDeck?.id ?? decks[0]?.id}
        />
        <StudyStreakWidget streak={stats.studyStreak} />
        <AccuracyWidget accuracy={stats.accuracy} />
        <WeeklyGoalWidget
          dailyGoal={settings?.dailyGoal ?? 20}
          activity={stats.dailyActivity}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentDecksWidget decks={decks} />
        <RecentActivityWidget activity={stats.dailyActivity} />
      </div>
    </div>
  );
}
