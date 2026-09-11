import { Activity } from 'lucide-react';
import type { DailyActivity } from '@/types';
import { formatDate } from '@/utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export interface RecentActivityWidgetProps {
  activity: DailyActivity[];
}

export function RecentActivityWidget({ activity }: RecentActivityWidgetProps) {
  const recent = [...activity]
    .filter((d) => d.reviews > 0)
    .slice(-7)
    .reverse();

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Your study history will appear here."
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
                    {day.studyMinutes} min studied
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium tabular-nums">{day.reviews} reviews</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(
                      day.accuracy * (day.accuracy <= 1 ? 100 : 1),
                    )}
                    % accuracy
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
