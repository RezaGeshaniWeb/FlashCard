'use client';

import { useMemo } from 'react';
import type { ReviewRating } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useT } from '@/i18n';

const RATING_META: Array<{
  rating: ReviewRating;
  labelKey: 'study.again' | 'study.hard' | 'study.good' | 'study.easy';
  key: string;
  className: string;
}> = [
  {
    rating: 'again',
    labelKey: 'study.again',
    key: '1',
    className: 'border-danger/40 text-danger hover:bg-danger-muted',
  },
  {
    rating: 'hard',
    labelKey: 'study.hard',
    key: '2',
    className: 'border-warning/40 text-warning hover:bg-warning-muted',
  },
  {
    rating: 'good',
    labelKey: 'study.good',
    key: '3',
    className: 'border-success/40 text-success hover:bg-success-muted',
  },
  {
    rating: 'easy',
    labelKey: 'study.easy',
    key: '4',
    className: 'border-primary/40 text-primary hover:bg-secondary',
  },
];

export interface RatingButtonsProps {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
  visible?: boolean;
}

export function RatingButtons({
  onRate,
  disabled = false,
  visible = true,
}: RatingButtonsProps) {
  const t = useT();

  const ratings = useMemo(
    () =>
      RATING_META.map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
    [t],
  );

  if (!visible) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        {t('study.flipToRate')}
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      role="group"
      aria-label={t('study.rateAria')}
    >
      {ratings.map(({ rating, label, key, className }) => (
        <Button
          key={rating}
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onRate(rating)}
          aria-label={`${label} (press ${key})`}
          className={cn('h-12 flex-col gap-0.5', className)}
        >
          <span className="font-semibold">{label}</span>
          <span className="text-[10px] opacity-70">{key}</span>
        </Button>
      ))}
    </div>
  );
}
