import {
  BookOpen,
  Brain,
  Clock,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { Stats } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';

export interface StatsOverviewProps {
  stats: Stats;
}

function toPercent(value: number): number {
  return Math.round(value * (value <= 1 ? 100 : 1));
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    {
      label: 'Total decks',
      value: String(stats.totalDecks),
      icon: Layers,
    },
    {
      label: 'Total cards',
      value: String(stats.totalCards),
      icon: BookOpen,
    },
    {
      label: 'Cards learned',
      value: String(stats.cardsLearned),
      icon: Brain,
    },
    {
      label: 'Accuracy',
      value: `${toPercent(stats.accuracy)}%`,
      icon: Target,
    },
    {
      label: 'Memory score',
      value: `${Math.round(stats.averageMemoryScore)}`,
      icon: Sparkles,
    },
    {
      label: 'Total reviews',
      value: String(stats.totalReviews),
      icon: TrendingUp,
    },
    {
      label: 'Study time',
      value: `${stats.totalStudyMinutes}m`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="animate-fade-in">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
              <p className="text-xl font-semibold tabular-nums text-foreground">
                {value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
