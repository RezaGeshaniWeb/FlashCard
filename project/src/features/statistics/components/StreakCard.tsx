'use client';

import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useT } from '@/i18n';

export interface StreakCardProps {
  streak: number;
  totalReviews: number;
}

export function StreakCard({ streak, totalReviews }: StreakCardProps) {
  const t = useT();

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{t('statistics.currentStreak')}</CardTitle>
        <Flame className="h-5 w-5 text-warning" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-4xl font-semibold tabular-nums text-foreground">
          {streak}
          <span className="ms-2 text-lg font-medium text-muted-foreground">
            {t('common.days')}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          {t('statistics.lifetimeReviews', {
            count: totalReviews.toLocaleString(),
          })}
        </p>
      </CardContent>
    </Card>
  );
}
