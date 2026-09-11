import {
  addDays,
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isBefore,
  isToday,
  parseISO,
  startOfDay,
} from 'date-fns';

export function toISOString(date: Date = new Date()): string {
  return date.toISOString();
}

export function parseDate(value: string | Date): Date {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatDate(
  value: string | Date,
  pattern = 'MMM d, yyyy',
): string {
  return format(parseDate(value), pattern);
}

export function formatRelative(value: string | Date): string {
  return formatDistanceToNow(parseDate(value), { addSuffix: true });
}

export function addDaysToNow(days: number): string {
  return addDays(new Date(), days).toISOString();
}

export function addDaysToDate(value: string | Date, days: number): string {
  return addDays(parseDate(value), days).toISOString();
}

export function isDue(nextReviewAt: string | Date, now: Date = new Date()): boolean {
  return isBefore(parseDate(nextReviewAt), now) || isToday(parseDate(nextReviewAt));
}

export function daysUntil(nextReviewAt: string | Date, now: Date = new Date()): number {
  return differenceInCalendarDays(parseDate(nextReviewAt), startOfDay(now));
}

export function startOfTodayISO(): string {
  return startOfDay(new Date()).toISOString();
}

export function toDateKey(value: string | Date = new Date()): string {
  return format(parseDate(value), 'yyyy-MM-dd');
}
