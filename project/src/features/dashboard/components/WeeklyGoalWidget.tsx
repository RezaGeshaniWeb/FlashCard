import { Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { DailyActivity } from '@/types';

export interface WeeklyGoalWidgetProps {
  dailyGoal: number;
  activity: DailyActivity[];
}

function reviewsThisWeek(activity: DailyActivity[]): number {
  const last7 = activity.slice(-7);
  return last7.reduce((sum, day) => sum + day.reviews, 0);
}

export function WeeklyGoalWidget({
  dailyGoal,
  activity,
}: WeeklyGoalWidgetProps) {
  const weeklyTarget = Math.max(dailyGoal * 7, 1);
  const done = reviewsThisWeek(activity);
  const percent = Math.min(100, Math.round((done / weeklyTarget) * 100));

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Weekly goal
        </CardTitle>
        <Flag className="h-4 w-4 text-info" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-semibold tabular-nums text-foreground">
          {done}
          <span className="ml-1 text-base font-medium text-muted-foreground">
            / {weeklyTarget}
          </span>
        </p>
        <Progress value={percent} label="Reviews this week" showValue />
      </CardContent>
    </Card>
  );
}
