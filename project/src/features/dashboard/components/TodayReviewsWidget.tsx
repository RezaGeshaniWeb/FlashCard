'use client';

import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useT } from '@/i18n';

export interface TodayReviewsWidgetProps {
  dueCount: number;
  firstDeckId?: string;
}

export function TodayReviewsWidget({
  dueCount,
  firstDeckId,
}: TodayReviewsWidgetProps) {
  const t = useT();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t('dashboard.todayReviews')}
        </CardTitle>
        <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-semibold tabular-nums text-foreground">
          {dueCount}
        </p>
        <p className="text-sm text-muted-foreground">
          {dueCount === 0 ? t('dashboard.caughtUp') : t('dashboard.waiting')}
        </p>
        {dueCount > 0 && firstDeckId ? (
          <Link
            href={ROUTES.STUDY(firstDeckId)}
            className="inline-flex h-8 w-fit items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary-hover"
          >
            {t('dashboard.startReview')}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
