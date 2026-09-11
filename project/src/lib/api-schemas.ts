import { z } from 'zod';

import { DIFFICULTY_LEVELS, REVIEW_RATINGS, STUDY_MODES } from '@/constants';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const createDeckSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a hex value')
    .optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
});

export const updateDeckSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a hex value')
    .optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const difficultySchema = z.enum(DIFFICULTY_LEVELS);

export const createCardSchema = z.object({
  front: z.string().trim().min(1, 'Front is required'),
  back: z.string().trim().min(1, 'Back is required'),
  hint: z.string().trim().optional(),
  example: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  difficulty: difficultySchema.optional(),
  notes: z.string().trim().optional(),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  audioUrl: z.union([z.string().url(), z.literal('')]).optional(),
});

export const updateCardSchema = createCardSchema.partial().extend({
  isBookmarked: z.boolean().optional(),
});

export const importCardsSchema = z.object({
  format: z.enum(['csv', 'json', 'markdown']),
  content: z.string().min(1, 'Content is required'),
});

export const studyModeSchema = z.enum(STUDY_MODES);

export const reviewSchema = z.object({
  cardId: z.string().min(1, 'cardId is required'),
  rating: z.enum(REVIEW_RATINGS),
  mode: studyModeSchema.optional(),
  sessionId: z.string().min(1).optional(),
});

export const sessionSchema = z.object({
  action: z.enum(['start', 'end']),
  mode: studyModeSchema.optional(),
  sessionId: z.string().min(1).optional(),
  stats: z
    .object({
      cardsReviewed: z.number().int().nonnegative().optional(),
      correctCount: z.number().int().nonnegative().optional(),
      incorrectCount: z.number().int().nonnegative().optional(),
      ratings: z
        .record(z.enum(REVIEW_RATINGS), z.number().int().nonnegative())
        .optional(),
    })
    .optional(),
});

export const cardNotesSchema = z.object({
  notes: z.string(),
});

export const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().min(2).max(16).optional(),
  timezone: z.string().min(1).max(64).optional(),
  dailyGoal: z.number().int().min(1).max(500).optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const importDataSchema = z.object({
  decks: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().optional(),
        color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        tags: z.array(z.string()).optional(),
        flashcards: z
          .array(
            z.object({
              front: z.string(),
              back: z.string(),
              hint: z.string().optional(),
              example: z.string().optional(),
              tags: z.array(z.string()).optional(),
              difficulty: difficultySchema.optional(),
              notes: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .min(1),
});

export const deckSortSchema = z.enum([
  'title',
  'createdAt',
  'updatedAt',
  'cardCount',
  'dueCount',
]);
