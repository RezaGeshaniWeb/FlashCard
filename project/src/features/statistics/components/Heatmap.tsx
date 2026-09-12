'use client';

import { useMemo } from 'react';
import {
  eachDayOfInterval,
  format,
  subDays,
  startOfDay,
} from 'date-fns';
import type { DailyActivity } from '@/types';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useT } from '@/i18n';

export interface HeatmapProps {
  activity: DailyActivity[];
  weeks?: number;
}

function intensityClass(reviews: number): string {
  if (reviews <= 0) return 'bg-muted';
  if (reviews < 5) return 'bg-primary/25';
  if (reviews < 15) return 'bg-primary/50';
  if (reviews < 30) return 'bg-primary/75';
  return 'bg-primary';
}

export function Heatmap({ activity, weeks = 12 }: HeatmapProps) {
  const t = useT();
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((d) => map.set(d.date.slice(0, 10), d.reviews));
    return map;
  }, [activity]);

  const days = useMemo(() => {
    const end = startOfDay(new Date());
    const start = subDays(end, weeks * 7 - 1);
    return eachDayOfInterval({ start, end });
  }, [weeks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.heatmap')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-1 overflow-x-auto"
          style={{
            gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
          }}
          role="img"
          aria-label={t('statistics.heatmapAria')}
        >
          {Array.from({ length: weeks }, (_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                const key = format(day, 'yyyy-MM-dd');
                const reviews = byDate.get(key) ?? 0;
                return (
                  <div
                    key={key}
                    title={`${key}: ${t('statistics.reviews')} ${reviews}`}
                    className={cn(
                      'aspect-square min-h-3 w-full rounded-sm',
                      intensityClass(reviews),
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t('statistics.less')}</span>
          <span className="h-3 w-3 rounded-sm bg-muted" />
          <span className="h-3 w-3 rounded-sm bg-primary/25" />
          <span className="h-3 w-3 rounded-sm bg-primary/50" />
          <span className="h-3 w-3 rounded-sm bg-primary/75" />
          <span className="h-3 w-3 rounded-sm bg-primary" />
          <span>{t('statistics.more')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
