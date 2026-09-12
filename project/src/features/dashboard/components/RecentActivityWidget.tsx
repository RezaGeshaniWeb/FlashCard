'use client';

import { Activity } from 'lucide-react';
import type { DailyActivity } from '@/types';
import { formatDate } from '@/utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useT } from '@/i18n';

export interface RecentActivityWidgetProps {
  activity: DailyActivity[];
}

export function RecentActivityWidget({ activity }: RecentActivityWidgetProps) {
  const t = useT();
  const recent = [...activity]
    .filter((d) => d.reviews > 0)
    .slice(-7)
    .reverse();

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            title={t('dashboard.noActivityYet')}
            description={t('dashboard.activityHint')}
            icon={<Activity className="h-6 w-6" aria-hidden />}
            className="border-0 py-8"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((day) => (
              <li
                key={day.date}
                className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(day.date, 'EEE, MMM d')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.minutesStudied', {
                      minutes: day.studyMinutes,
                    })}
                  </p>
                </div>
                <div className="text-end text-sm">
                  <p className="font-medium tabular-nums">
                    {t('dashboard.reviewsCount', { count: day.reviews })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.accuracyPercent', {
                      percent: Math.round(
                        day.accuracy * (day.accuracy <= 1 ? 100 : 1),
                      ),
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
