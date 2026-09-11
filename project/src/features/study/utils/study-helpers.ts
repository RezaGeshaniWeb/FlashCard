import type { ReviewRating } from '@/types';

export function shuffleCards<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = tmp as T;
  }
  return copy;
}

export function isCorrectRating(rating: ReviewRating | string): boolean {
  return rating === 'good' || rating === 'easy';
}
