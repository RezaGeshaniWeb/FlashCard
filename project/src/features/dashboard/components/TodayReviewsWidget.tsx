import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface TodayReviewsWidgetProps {
  dueCount: number;
  firstDeckId?: string;
}

export function TodayReviewsWidget({
  dueCount,
  firstDeckId,
}: TodayReviewsWidgetProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Today&apos;s reviews
        </CardTitle>
        <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-semibold tabular-nums text-foreground">
          {dueCount}
        </p>
        <p className="text-sm text-muted-foreground">
          {dueCount === 0
            ? 'You are all caught up for today.'
            : 'Cards waiting for spaced review.'}
        </p>
        {dueCount > 0 && firstDeckId ? (
          <Link
            href={ROUTES.STUDY(firstDeckId)}
            className="inline-flex h-8 w-fit items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary-hover"
          >
            Start review
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
