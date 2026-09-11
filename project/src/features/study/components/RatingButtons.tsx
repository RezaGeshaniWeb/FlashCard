'use client';

import type { ReviewRating } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const RATINGS: Array<{
  rating: ReviewRating;
  label: string;
  key: string;
  className: string;
}> = [
  {
    rating: 'again',
    label: 'Again',
    key: '1',
    className: 'border-danger/40 text-danger hover:bg-danger-muted',
  },
  {
    rating: 'hard',
    label: 'Hard',
    key: '2',
    className: 'border-warning/40 text-warning hover:bg-warning-muted',
  },
  {
    rating: 'good',
    label: 'Good',
    key: '3',
    className: 'border-success/40 text-success hover:bg-success-muted',
  },
  {
    rating: 'easy',
    label: 'Easy',
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
  if (!visible) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Flip the card to rate your recall
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      role="group"
      aria-label="Rate recall"
    >
      {RATINGS.map(({ rating, label, key, className }) => (
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
