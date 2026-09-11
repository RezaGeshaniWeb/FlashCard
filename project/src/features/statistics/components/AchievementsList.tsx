import { Award, CheckCircle2, Lock } from 'lucide-react';
import type { Stats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface AchievementsListProps {
  stats: Stats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

function buildAchievements(stats: Stats): Achievement[] {
  return [
    {
      id: 'first-review',
      title: 'First steps',
      description: 'Complete your first review',
      unlocked: stats.totalReviews >= 1,
    },
    {
      id: 'streak-7',
      title: 'Week warrior',
      description: 'Reach a 7-day study streak',
      unlocked: stats.studyStreak >= 7,
    },
    {
      id: 'streak-30',
      title: 'Consistency king',
      description: 'Reach a 30-day study streak',
      unlocked: stats.studyStreak >= 30,
    },
    {
      id: 'cards-50',
      title: 'Half century',
      description: 'Learn 50 cards',
      unlocked: stats.cardsLearned >= 50,
    },
    {
      id: 'accuracy-80',
      title: 'Sharp mind',
      description: 'Reach 80% overall accuracy',
      unlocked:
        Math.round(stats.accuracy * (stats.accuracy <= 1 ? 100 : 1)) >= 80,
    },
    {
      id: 'reviews-500',
      title: 'Dedicated learner',
      description: 'Complete 500 reviews',
      unlocked: stats.totalReviews >= 500,
    },
  ];
}

export function AchievementsList({ stats }: AchievementsListProps) {
  const achievements = buildAchievements(stats);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Achievements</CardTitle>
        <Badge variant="default">
          {unlockedCount}/{achievements.length}
        </Badge>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {achievements.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-start gap-3 rounded-md border border-border p-3',
                item.unlocked ? 'bg-primary/5' : 'opacity-70',
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  item.unlocked
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {item.unlocked ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                ) : (
                  <Lock className="h-4 w-4" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  {item.unlocked ? (
                    <Award className="h-3.5 w-3.5 text-warning" aria-hidden />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
