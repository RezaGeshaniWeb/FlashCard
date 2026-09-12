'use client';

import { Progress } from '@/components/ui/Progress';
import { useT } from '@/i18n';
import type { StudySessionStats } from '../hooks/useStudySession';

export interface StudyProgressProps {
  current: number;
  total: number;
  stats: StudySessionStats;
}

export function StudyProgress({ current, total, stats }: StudyProgressProps) {
  const t = useT();
  const value = total === 0 ? 0 : current;
  const accuracy =
    stats.reviewed === 0
      ? 0
      : Math.round((stats.correct / stats.reviewed) * 100);

  return (
    <div className="flex flex-col gap-2">
      <Progress
        value={value}
        max={Math.max(total, 1)}
        label={t('study.cardOf', {
          current: Math.min(current, total),
          total,
        })}
        showValue={false}
      />
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>
          {t('study.reviewed')}{' '}
          <strong className="text-foreground tabular-nums">
            {stats.reviewed}
          </strong>
        </span>
        <span>
          {t('study.correct')}{' '}
          <strong className="text-success tabular-nums">{stats.correct}</strong>
        </span>
        <span>
          {t('study.incorrect')}{' '}
          <strong className="text-danger tabular-nums">
            {stats.incorrect}
          </strong>
        </span>
        <span>
          {t('study.accuracy')}{' '}
          <strong className="text-foreground tabular-nums">{accuracy}%</strong>
        </span>
      </div>
    </div>
  );
}
