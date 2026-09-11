import { describe, expect, it } from 'vitest';
import { SRS_INTERVALS } from '@/constants';
import { calculateNextReview, type SrsCardState } from '@/utils/srs';

const baseState: SrsCardState = {
  easeFactor: SRS_INTERVALS.DEFAULT_EASE,
  interval: 1,
  repetitions: 0,
};

describe('calculateNextReview', () => {
  it('resets repetitions and interval on again', () => {
    const result = calculateNextReview('again', {
      easeFactor: 2.5,
      interval: 10,
      repetitions: 5,
    });

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(SRS_INTERVALS.AGAIN);
    expect(result.easeFactor).toBeGreaterThanOrEqual(SRS_INTERVALS.MIN_EASE);
  });

  it('increases interval on good ratings across early repetitions', () => {
    const first = calculateNextReview('good', baseState);
    expect(first.repetitions).toBe(1);
    expect(first.interval).toBe(SRS_INTERVALS.FIRST);

    const second = calculateNextReview('good', {
      easeFactor: first.easeFactor,
      interval: first.interval,
      repetitions: first.repetitions,
    });
    expect(second.repetitions).toBe(2);
    expect(second.interval).toBe(SRS_INTERVALS.SECOND);
    expect(second.interval).toBeGreaterThan(first.interval);

    const third = calculateNextReview('good', {
      easeFactor: second.easeFactor,
      interval: second.interval,
      repetitions: second.repetitions,
    });
    expect(third.repetitions).toBe(3);
    expect(third.interval).toBeGreaterThan(second.interval);
  });

  it('applies easy bonus on top of the scheduled interval', () => {
    const state: SrsCardState = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
    };
    const good = calculateNextReview('good', state);
    const easy = calculateNextReview('easy', state);

    // easy raises ease to 2.6 → base interval 16, then × 1.3 bonus
    const easyBaseInterval = Math.max(1, Math.round(6 * 2.6));
    expect(easy.interval).toBe(
      Math.max(1, Math.round(easyBaseInterval * SRS_INTERVALS.EASY_BONUS)),
    );
    expect(easy.interval).toBeGreaterThan(good.interval);
  });

  it('keeps memory score within 0–100', () => {
    const ratings = ['again', 'hard', 'good', 'easy'] as const;

    for (const rating of ratings) {
      const result = calculateNextReview(rating, {
        easeFactor: 2.5,
        interval: 30,
        repetitions: 8,
      });
      expect(result.memoryScore).toBeGreaterThanOrEqual(0);
      expect(result.memoryScore).toBeLessThanOrEqual(100);
    }

    const low = calculateNextReview('again', {
      easeFactor: SRS_INTERVALS.MIN_EASE,
      interval: 0,
      repetitions: 0,
    });
    expect(low.memoryScore).toBeGreaterThanOrEqual(0);
    expect(low.memoryScore).toBeLessThanOrEqual(100);

    const high = calculateNextReview('easy', {
      easeFactor: 3.0,
      interval: 120,
      repetitions: 20,
    });
    expect(high.memoryScore).toBeGreaterThanOrEqual(0);
    expect(high.memoryScore).toBeLessThanOrEqual(100);
  });
});
