import type { DifficultyLevel, StudyModeConstant } from '@/constants';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type StudyMode = StudyModeConstant;

export type Difficulty = DifficultyLevel;

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dailyGoal: number;
  notificationsEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  settings: UserSettings;
  createdAt: string;
  /** One-time password reset token (local demo; no email delivery). */
  resetToken?: string;
  resetTokenExpiresAt?: string;
}

export type PublicUser = Omit<
  User,
  'passwordHash' | 'resetToken' | 'resetTokenExpiresAt'
>;

export interface Deck {
  id: string;
  userId: string;
  title: string;
  description: string;
  color: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  example?: string;
  tags: string[];
  difficulty: Difficulty;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
  memoryScore: number;
  isBookmarked: boolean;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  mode: StudyMode;
  startedAt: string;
  endedAt?: string;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  ratings: Partial<Record<ReviewRating, number>>;
}

export interface DeckStats {
  deckId: string;
  totalCards: number;
  dueCards: number;
  learnedCards: number;
  averageMemoryScore: number;
  accuracy: number;
}

export interface DailyActivity {
  date: string;
  reviews: number;
  studyMinutes: number;
  accuracy: number;
}

export interface Stats {
  userId: string;
  totalDecks: number;
  totalCards: number;
  cardsDueToday: number;
  cardsLearned: number;
  studyStreak: number;
  totalReviews: number;
  accuracy: number;
  averageMemoryScore: number;
  totalStudyMinutes: number;
  dailyActivity: DailyActivity[];
  deckStats: DeckStats[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface CreateDeckInput {
  title: string;
  description?: string;
  color?: string;
  tags?: string[];
}

export interface UpdateDeckInput {
  title?: string;
  description?: string;
  color?: string;
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface CreateFlashcardInput {
  front: string;
  back: string;
  hint?: string;
  example?: string;
  tags?: string[];
  difficulty?: Difficulty;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UpdateFlashcardInput {
  front?: string;
  back?: string;
  hint?: string;
  example?: string;
  tags?: string[];
  difficulty?: Difficulty;
  isBookmarked?: boolean;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ExportFlashcard {
  front: string;
  back: string;
  hint?: string;
  example?: string;
  tags?: string[];
  difficulty?: Difficulty;
  notes?: string;
}

export interface DeckWithCounts extends Deck {
  cardCount: number;
  dueCount: number;
}

export interface DeckWithStats extends Deck {
  stats: DeckStats;
}

export type DeckSort =
  | 'title'
  | 'createdAt'
  | 'updatedAt'
  | 'cardCount'
  | 'dueCount';

export interface UserExportData {
  version: 1;
  exportedAt: string;
  user: PublicUser;
  decks: Deck[];
  flashcards: Flashcard[];
  sessions: StudySession[];
}
