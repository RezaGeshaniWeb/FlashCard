'use client';

import { Award, CheckCircle2, Lock } from 'lucide-react';
import type { Stats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useT } from '@/i18n';

export interface AchievementsListProps {
  stats: Stats;
}

export function AchievementsList({ stats }: AchievementsListProps) {
  const t = useT();

  const achievements = [
    {
      id: 'first-review',
      title: t('statistics.firstStepsTitle'),
      description: t('statistics.firstStepsDesc'),
      unlocked: stats.totalReviews >= 1,
    },
    {
      id: 'streak-7',
      title: t('statistics.weekWarriorTitle'),
      description: t('statistics.weekWarriorDesc'),
      unlocked: stats.studyStreak >= 7,
    },
    {
      id: 'streak-30',
      title: t('statistics.consistencyKingTitle'),
      description: t('statistics.consistencyKingDesc'),
      unlocked: stats.studyStreak >= 30,
    },
    {
      id: 'cards-50',
      title: t('statistics.halfCenturyTitle'),
      description: t('statistics.halfCenturyDesc'),
      unlocked: stats.cardsLearned >= 50,
    },
    {
      id: 'accuracy-80',
      title: t('statistics.sharpMindTitle'),
      description: t('statistics.sharpMindDesc'),
      unlocked:
        Math.round(stats.accuracy * (stats.accuracy <= 1 ? 100 : 1)) >= 80,
    },
    {
      id: 'reviews-500',
      title: t('statistics.dedicatedLearnerTitle'),
      description: t('statistics.dedicatedLearnerDesc'),
      unlocked: stats.totalReviews >= 500,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{t('statistics.achievements')}</CardTitle>
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
