'use client';

import { Shuffle, Timer } from 'lucide-react';
import type { StudyMode } from '@/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import type { StudyOrder } from '../hooks/useStudySession';

const MODE_OPTIONS = [
  { value: 'practice', label: 'Practice' },
  { value: 'exam', label: 'Exam' },
  { value: 'timed', label: 'Timed' },
  { value: 'review', label: 'Review' },
];

const ORDER_OPTIONS = [
  { value: 'sequential', label: 'Sequential' },
  { value: 'random', label: 'Random' },
];

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
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-36">
        <Select
          label="Mode"
          options={MODE_OPTIONS}
          value={mode === 'sequential' || mode === 'random' ? 'practice' : mode}
          onChange={(e) => onModeChange(e.target.value as StudyMode)}
        />
      </div>
      <div className="w-36">
        <Select
          label="Order"
          options={ORDER_OPTIONS}
          value={order}
          onChange={(e) => onOrderChange(e.target.value as StudyOrder)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onShuffle}
        aria-label="Shuffle cards"
        className="h-10"
      >
        <Shuffle className="h-4 w-4" aria-hidden />
        Shuffle
      </Button>
      {mode === 'timed' && typeof secondsLeft === 'number' ? (
        <Badge variant="info" className="ml-auto flex items-center gap-1.5 px-3 py-1.5">
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
