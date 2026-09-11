import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface StudyStreakWidgetProps {
  streak: number;
}

export function StudyStreakWidget({ streak }: StudyStreakWidgetProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Study streak
        </CardTitle>
        <Flame className="h-4 w-4 text-warning" aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums text-foreground">
          {streak}
          <span className="ml-1 text-base font-medium text-muted-foreground">
            days
          </span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {streak > 0
            ? 'Keep reviewing daily to protect your streak.'
            : 'Complete a session today to start a streak.'}
        </p>
      </CardContent>
    </Card>
  );
}
