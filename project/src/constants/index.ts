export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? 'FlashMaster';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  DECKS: '/decks',
  DECK_DETAIL: (id: string) => `/decks/${id}` as const,
  STUDY: (deckId: string) => `/study/${deckId}` as const,
  STATISTICS: '/statistics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.DECKS,
  '/study',
  ROUTES.STATISTICS,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
] as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

export const AUTH_COOKIE_NAME =
  process.env.AUTH_STORAGE_KEY ?? 'flashmaster_token';

/** Default SM-2 starting ease factor */
export const SRS_DEFAULT_EASE_FACTOR = 2.5;

/** Minimum allowed ease factor */
export const SRS_MIN_EASE_FACTOR = 1.3;

/** Interval in days after first successful review */
export const SRS_FIRST_INTERVAL_DAYS = 1;

/** Interval in days after second successful review */
export const SRS_SECOND_INTERVAL_DAYS = 6;

export const SRS_INTERVALS = {
  AGAIN: 0,
  HARD_MULTIPLIER: 1.2,
  EASY_BONUS: 1.3,
  DEFAULT_EASE: SRS_DEFAULT_EASE_FACTOR,
  MIN_EASE: SRS_MIN_EASE_FACTOR,
  FIRST: SRS_FIRST_INTERVAL_DAYS,
  SECOND: SRS_SECOND_INTERVAL_DAYS,
} as const;

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const STUDY_MODES = [
  'practice',
  'review',
  'exam',
  'timed',
  'random',
  'sequential',
] as const;

export type StudyModeConstant = (typeof STUDY_MODES)[number];

export const REVIEW_RATINGS = ['again', 'hard', 'good', 'easy'] as const;
