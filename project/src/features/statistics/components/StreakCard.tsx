import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface StreakCardProps {
  streak: number;
  totalReviews: number;
}

export function StreakCard({ streak, totalReviews }: StreakCardProps) {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Current streak</CardTitle>
        <Flame className="h-5 w-5 text-warning" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-4xl font-semibold tabular-nums text-foreground">
          {streak}
          <span className="ml-2 text-lg font-medium text-muted-foreground">
            days
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          {totalReviews.toLocaleString()} lifetime reviews completed.
        </p>
      </CardContent>
    </Card>
  );
}
