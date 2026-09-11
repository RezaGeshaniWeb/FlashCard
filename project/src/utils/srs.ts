import { SRS_INTERVALS } from '@/constants';
import type { ReviewRating } from '@/types';
import { addDaysToNow } from '@/utils/dates';

export interface SrsCardState {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SrsResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
  memoryScore: number;
}

const RATING_QUALITY: Record<ReviewRating, number> = {
  again: 0,
  hard: 2,
  good: 4,
  easy: 5,
};

function clampEase(easeFactor: number): number {
  return Math.max(SRS_INTERVALS.MIN_EASE, Number(easeFactor.toFixed(2)));
}

function computeEaseFactor(currentEase: number, quality: number): number {
  const delta =
    0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  return clampEase(currentEase + delta);
}

function computeMemoryScore(
  easeFactor: number,
  repetitions: number,
  interval: number,
  quality: number,
): number {
  const easeScore = ((easeFactor - SRS_INTERVALS.MIN_EASE) / 1.7) * 35;
  const repScore = Math.min(repetitions, 10) * 4;
  const intervalScore = Math.min(interval, 60) * 0.5;
  const qualityScore = quality * 6;
  const raw = easeScore + repScore + intervalScore + qualityScore;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * SM-2 inspired spaced repetition update.
 * Ratings map to SM-2 quality scores: again=0, hard=2, good=4, easy=5.
 */
export function calculateNextReview(
  rating: ReviewRating,
  state: SrsCardState,
): SrsResult {
  const quality = RATING_QUALITY[rating];
  let { easeFactor, interval, repetitions } = state;

  easeFactor = computeEaseFactor(easeFactor, quality);

  if (quality < 3) {
    repetitions = 0;
    interval =
      rating === 'again'
        ? SRS_INTERVALS.AGAIN
        : Math.max(1, Math.round(Math.max(interval, 1) * SRS_INTERVALS.HARD_MULTIPLIER));
  } else {
    if (repetitions === 0) {
      interval = SRS_INTERVALS.FIRST;
    } else if (repetitions === 1) {
      interval = SRS_INTERVALS.SECOND;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }

    if (rating === 'easy') {
      interval = Math.max(1, Math.round(interval * SRS_INTERVALS.EASY_BONUS));
    }

    repetitions += 1;
  }

  const nextReviewAt = addDaysToNow(interval);
  const memoryScore = computeMemoryScore(
    easeFactor,
    repetitions,
    interval,
    quality,
  );

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewAt,
    memoryScore,
  };
}
