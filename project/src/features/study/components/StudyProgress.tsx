import { Progress } from '@/components/ui/Progress';
import type { StudySessionStats } from '../hooks/useStudySession';

export interface StudyProgressProps {
  current: number;
  total: number;
  stats: StudySessionStats;
}

export function StudyProgress({ current, total, stats }: StudyProgressProps) {
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
        label={`Card ${Math.min(current, total)} of ${total}`}
        showValue={false}
      />
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>
          Reviewed:{' '}
          <strong className="text-foreground tabular-nums">{stats.reviewed}</strong>
        </span>
        <span>
          Correct:{' '}
          <strong className="text-success tabular-nums">{stats.correct}</strong>
        </span>
        <span>
          Incorrect:{' '}
          <strong className="text-danger tabular-nums">{stats.incorrect}</strong>
        </span>
        <span>
          Accuracy:{' '}
          <strong className="text-foreground tabular-nums">{accuracy}%</strong>
        </span>
      </div>
    </div>
  );
}
