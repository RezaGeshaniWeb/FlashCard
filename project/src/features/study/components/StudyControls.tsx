'use client';

import { useMemo } from 'react';
import { Shuffle, Timer } from 'lucide-react';
import type { StudyMode } from '@/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useT } from '@/i18n';
import type { StudyOrder } from '../hooks/useStudySession';

export interface StudyControlsProps {
  mode: StudyMode;
  order: StudyOrder;
  secondsLeft?: number;
  onModeChange: (mode: StudyMode) => void;
  onOrderChange: (order: StudyOrder) => void;
  onShuffle: () => void;
}

export function StudyControls({
  mode,
  order,
  secondsLeft,
  onModeChange,
  onOrderChange,
  onShuffle,
}: StudyControlsProps) {
  const t = useT();

  const modeOptions = useMemo(
    () => [
      { value: 'practice', label: t('study.practice') },
      { value: 'exam', label: t('study.exam') },
      { value: 'timed', label: t('study.timed') },
      { value: 'review', label: t('study.review') },
    ],
    [t],
  );

  const orderOptions = useMemo(
    () => [
      { value: 'sequential', label: t('study.sequential') },
      { value: 'random', label: t('study.random') },
    ],
    [t],
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-36">
        <Select
          label={t('study.mode')}
          options={modeOptions}
          value={mode === 'sequential' || mode === 'random' ? 'practice' : mode}
          onChange={(e) => onModeChange(e.target.value as StudyMode)}
        />
      </div>
      <div className="w-36">
        <Select
          label={t('study.order')}
          options={orderOptions}
          value={order}
          onChange={(e) => onOrderChange(e.target.value as StudyOrder)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onShuffle}
        aria-label={t('study.shuffleAria')}
        className="h-10"
      >
        <Shuffle className="h-4 w-4" aria-hidden />
        {t('study.shuffle')}
      </Button>
      {mode === 'timed' && typeof secondsLeft === 'number' ? (
        <Badge
          variant="info"
          className="ms-auto flex items-center gap-1.5 px-3 py-1.5"
        >
          <Timer className="h-3.5 w-3.5" aria-hidden />
          <span className="tabular-nums" aria-live="polite">
            {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, '0')}
          </span>
        </Badge>
      ) : null}
    </div>
  );
}
