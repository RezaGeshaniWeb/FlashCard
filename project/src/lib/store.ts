import { compareSync, hashSync } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

import { SRS_DEFAULT_EASE_FACTOR } from '@/constants';
import type {
  CreateDeckInput,
  CreateFlashcardInput,
  DailyActivity,
  Deck,
  DeckSort,
  DeckStats,
  DeckWithCounts,
  DeckWithStats,
  Difficulty,
  ExportFlashcard,
  Flashcard,
  PublicUser,
  ReviewRating,
  Stats,
  StudyMode,
  StudySession,
  UpdateDeckInput,
  UpdateFlashcardInput,
  User,
  UserExportData,
  UserSettings,
} from '@/types';
import { isDue, toDateKey, toISOString } from '@/utils/dates';
import { calculateNextReview } from '@/utils/srs';

const DB_RELATIVE_PATH = ['data', 'db.json'] as const;

interface Database {
  users: User[];
  decks: Deck[];
  flashcards: Flashcard[];
  sessions: StudySession[];
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  timezone: 'UTC',
  dailyGoal: 20,
  notificationsEnabled: true,
};

function nowIso(): string {
  return toISOString();
}

function createId(): string {
  return randomUUID();
}

function defaultCardFields(
  overrides: Partial<Flashcard> = {},
): Pick<
  Flashcard,
  | 'easeFactor'
  | 'interval'
  | 'repetitions'
  | 'nextReviewAt'
  | 'memoryScore'
  | 'isBookmarked'
  | 'tags'
  | 'difficulty'
> {
  return {
    tags: [],
    difficulty: 'beginner',
    easeFactor: SRS_DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewAt: nowIso(),
    memoryScore: 0,
    isBookmarked: false,
    ...overrides,
  };
}

function buildSeedDatabase(): Database {
  const createdAt = nowIso();
  const userId = createId();
  const passwordHash = hashSync('password123', 10);

  const spanishDeckId = createId();
  const jsDeckId = createId();
  const capitalsDeckId = createId();

  const user: User = {
    id: userId,
    email: 'demo@flashmaster.com',
    name: 'Demo User',
    passwordHash,
    settings: { ...DEFAULT_SETTINGS },
    createdAt,
  };

  const decks: Deck[] = [
    {
      id: spanishDeckId,
      userId,
      title: 'Spanish Vocabulary',
      description: 'Essential Spanish words and phrases for beginners.',
      color: '#0D9488',
      tags: ['language', 'spanish'],
      isFavorite: true,
      isArchived: false,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: jsDeckId,
      userId,
      title: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts every developer should know.',
      color: '#CA8A04',
      tags: ['programming', 'javascript'],
      isFavorite: false,
      isArchived: false,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: capitalsDeckId,
      userId,
      title: 'World Capitals',
      description: 'Capital cities of countries around the world.',
      color: '#2563EB',
      tags: ['geography'],
      isFavorite: false,
      isArchived: false,
      createdAt,
      updatedAt: createdAt,
    },
  ];

  type SeedCard = {
    deckId: string;
    front: string;
    back: string;
    hint?: string;
    example?: string;
    tags?: string[];
    difficulty?: Difficulty;
  };

  const seedCards: SeedCard[] = [
    {
      deckId: spanishDeckId,
      front: 'Hola',
      back: 'Hello',
      example: '¡Hola! ¿Cómo estás?',
      tags: ['greeting'],
      difficulty: 'beginner',
    },
    {
      deckId: spanishDeckId,
      front: 'Gracias',
      back: 'Thank you',
      example: 'Muchas gracias por tu ayuda.',
      tags: ['courtesy'],
      difficulty: 'beginner',
    },
    {
      deckId: spanishDeckId,
      front: 'Por favor',
      back: 'Please',
      tags: ['courtesy'],
      difficulty: 'beginner',
    },
    {
      deckId: spanishDeckId,
      front: 'Buenos días',
      back: 'Good morning',
      tags: ['greeting'],
      difficulty: 'beginner',
    },
    {
      deckId: spanishDeckId,
      front: '¿Cómo te llamas?',
      back: 'What is your name?',
      hint: 'Used when meeting someone',
      tags: ['questions'],
      difficulty: 'intermediate',
    },
    {
      deckId: jsDeckId,
      front: 'What is a closure?',
      back: 'A function that remembers variables from its outer lexical scope.',
      hint: 'Scope + function',
      tags: ['functions'],
      difficulty: 'intermediate',
    },
    {
      deckId: jsDeckId,
      front: 'What does === do?',
      back: 'Strict equality comparison (value and type).',
      tags: ['operators'],
      difficulty: 'beginner',
    },
    {
      deckId: jsDeckId,
      front: 'What is hoisting?',
      back: 'Declarations are moved to the top of their scope during compilation.',
      tags: ['fundamentals'],
      difficulty: 'intermediate',
    },
    {
      deckId: jsDeckId,
      front: 'What is a Promise?',
      back: 'An object representing the eventual result of an asynchronous operation.',
      tags: ['async'],
      difficulty: 'intermediate',
    },
    {
      deckId: jsDeckId,
      front: 'What is the event loop?',
      back: 'The mechanism that handles async callbacks via the call stack and task queues.',
      tags: ['runtime'],
      difficulty: 'advanced',
    },
    {
      deckId: capitalsDeckId,
      front: 'France',
      back: 'Paris',
      tags: ['europe'],
      difficulty: 'beginner',
    },
    {
      deckId: capitalsDeckId,
      front: 'Japan',
      back: 'Tokyo',
      tags: ['asia'],
      difficulty: 'beginner',
    },
    {
      deckId: capitalsDeckId,
      front: 'Brazil',
      back: 'Brasília',
      hint: 'Not Rio de Janeiro',
      tags: ['south-america'],
      difficulty: 'intermediate',
    },
    {
      deckId: capitalsDeckId,
      front: 'Australia',
      back: 'Canberra',
      hint: 'Not Sydney',
      tags: ['oceania'],
      difficulty: 'intermediate',
    },
    {
      deckId: capitalsDeckId,
      front: 'Egypt',
      back: 'Cairo',
      tags: ['africa'],
      difficulty: 'beginner',
    },
  ];

  const flashcards: Flashcard[] = seedCards.map((card) => {
    const timestamp = nowIso();
    return {
      id: createId(),
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      hint: card.hint,
      example: card.example,
      ...defaultCardFields({
        tags: card.tags ?? [],
        difficulty: card.difficulty ?? 'beginner',
      }),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  return {
    users: [user],
    decks,
    flashcards,
    sessions: [],
  };
}

let db: Database | null = null;
let persistEnabled = true;

async function getFsModules(): Promise<{
  fs: typeof import('node:fs/promises');
  path: typeof import('node:path');
} | null> {
  try {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    return { fs, path };
  } catch {
    return null;
  }
}

async function resolveDbPath(
  pathMod: typeof import('node:path'),
): Promise<string> {
  return pathMod.join(process.cwd(), ...DB_RELATIVE_PATH);
}

async function loadFromDisk(): Promise<Database | null> {
  const mods = await getFsModules();
  if (!mods) {
    return null;
  }

  try {
    const dbPath = await resolveDbPath(mods.path);
    const raw = await mods.fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(raw) as Database;
    if (
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.decks) ||
      !Array.isArray(parsed.flashcards) ||
      !Array.isArray(parsed.sessions)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function persistToDisk(data: Database): Promise<void> {
  if (!persistEnabled) {
    return;
  }

  const mods = await getFsModules();
  if (!mods) {
    return;
  }

  try {
    const dbPath = await resolveDbPath(mods.path);
    await mods.fs.mkdir(mods.path.dirname(dbPath), { recursive: true });
    await mods.fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // Persistence is best-effort for local/dev stores.
  }
}

async function ensureDb(): Promise<Database> {
  if (db) {
    return db;
  }

  const fromDisk = await loadFromDisk();
  db = fromDisk ?? buildSeedDatabase();

  if (!fromDisk) {
    await persistToDisk(db);
  }

  return db;
}

async function mutate<T>(fn: (data: Database) => T): Promise<T> {
  const data = await ensureDb();
  const result = fn(data);
  await persistToDisk(data);
  return result;
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    settings: user.settings,
    createdAt: user.createdAt,
  };
}

export const store = {
  /** Disable disk writes (useful in tests). */
  setPersistEnabled(enabled: boolean): void {
    persistEnabled = enabled;
  },

  async reset(): Promise<void> {
    db = buildSeedDatabase();
    await persistToDisk(db);
  },

  async getUsers(): Promise<PublicUser[]> {
    const data = await ensureDb();
    return data.users.map(toPublicUser);
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const data = await ensureDb();
    const normalized = email.trim().toLowerCase();
    return (
      data.users.find((u) => u.email.toLowerCase() === normalized) ?? null
    );
  },

  async findUserById(id: string): Promise<User | null> {
    const data = await ensureDb();
    return data.users.find((u) => u.id === id) ?? null;
  },

  async createUser(input: {
    email: string;
    name: string;
    password: string;
    settings?: Partial<UserSettings>;
  }): Promise<PublicUser> {
    return mutate((data) => {
      const normalized = input.email.trim().toLowerCase();
      if (data.users.some((u) => u.email.toLowerCase() === normalized)) {
        throw new Error('Email already registered');
      }

      const user: User = {
        id: createId(),
        email: normalized,
        name: input.name.trim(),
        passwordHash: hashSync(input.password, 10),
        settings: { ...DEFAULT_SETTINGS, ...input.settings },
        createdAt: nowIso(),
      };

      data.users.push(user);
      return toPublicUser(user);
    });
  },

  async getDecksByUser(userId: string): Promise<Deck[]> {
    const data = await ensureDb();
    return data.decks.filter((d) => d.userId === userId);
  },

  async getDeckById(deckId: string): Promise<Deck | null> {
    const data = await ensureDb();
    return data.decks.find((d) => d.id === deckId) ?? null;
  },

  async createDeck(userId: string, input: CreateDeckInput): Promise<Deck> {
    return mutate((data) => {
      const timestamp = nowIso();
      const deck: Deck = {
        id: createId(),
        userId,
        title: input.title.trim(),
        description: input.description?.trim() ?? '',
        color: input.color ?? '#0D9488',
        tags: input.tags ?? [],
        isFavorite: false,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      data.decks.push(deck);
      return deck;
    });
  },

  async updateDeck(
    deckId: string,
    input: UpdateDeckInput,
  ): Promise<Deck | null> {
    return mutate((data) => {
      const deck = data.decks.find((d) => d.id === deckId);
      if (!deck) {
        return null;
      }

      if (input.title !== undefined) deck.title = input.title.trim();
      if (input.description !== undefined) {
        deck.description = input.description.trim();
      }
      if (input.color !== undefined) deck.color = input.color;
      if (input.tags !== undefined) deck.tags = input.tags;
      if (input.isFavorite !== undefined) deck.isFavorite = input.isFavorite;
      if (input.isArchived !== undefined) deck.isArchived = input.isArchived;
      deck.updatedAt = nowIso();
      return deck;
    });
  },

  async deleteDeck(deckId: string): Promise<boolean> {
    return mutate((data) => {
      const index = data.decks.findIndex((d) => d.id === deckId);
      if (index === -1) {
        return false;
      }
      data.decks.splice(index, 1);
      data.flashcards = data.flashcards.filter((c) => c.deckId !== deckId);
      data.sessions = data.sessions.filter((s) => s.deckId !== deckId);
      return true;
    });
  },

  async getCardsByDeck(deckId: string): Promise<Flashcard[]> {
    const data = await ensureDb();
    return data.flashcards.filter((c) => c.deckId === deckId);
  },

  async getCardById(cardId: string): Promise<Flashcard | null> {
    const data = await ensureDb();
    return data.flashcards.find((c) => c.id === cardId) ?? null;
  },

  async createCard(
    deckId: string,
    input: CreateFlashcardInput,
  ): Promise<Flashcard> {
    return mutate((data) => {
      const deck = data.decks.find((d) => d.id === deckId);
      if (!deck) {
        throw new Error('Deck not found');
      }

      const timestamp = nowIso();
      const card: Flashcard = {
        id: createId(),
        deckId,
        front: input.front.trim(),
        back: input.back.trim(),
        hint: input.hint?.trim(),
        example: input.example?.trim(),
        notes: input.notes?.trim(),
        imageUrl: input.imageUrl,
        audioUrl: input.audioUrl,
        ...defaultCardFields({
          tags: input.tags ?? [],
          difficulty: input.difficulty ?? 'beginner',
        }),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      data.flashcards.push(card);
      deck.updatedAt = timestamp;
      return card;
    });
  },

  async updateCard(
    cardId: string,
    input: UpdateFlashcardInput,
  ): Promise<Flashcard | null> {
    return mutate((data) => {
      const card = data.flashcards.find((c) => c.id === cardId);
      if (!card) {
        return null;
      }

      if (input.front !== undefined) card.front = input.front.trim();
      if (input.back !== undefined) card.back = input.back.trim();
      if (input.hint !== undefined) card.hint = input.hint.trim() || undefined;
      if (input.example !== undefined) {
        card.example = input.example.trim() || undefined;
      }
      if (input.tags !== undefined) card.tags = input.tags;
      if (input.difficulty !== undefined) card.difficulty = input.difficulty;
      if (input.isBookmarked !== undefined) {
        card.isBookmarked = input.isBookmarked;
      }
      if (input.notes !== undefined) {
        card.notes = input.notes.trim() || undefined;
      }
      if (input.imageUrl !== undefined) card.imageUrl = input.imageUrl;
      if (input.audioUrl !== undefined) card.audioUrl = input.audioUrl;
      card.updatedAt = nowIso();
      return card;
    });
  },

  async deleteCard(cardId: string): Promise<boolean> {
    return mutate((data) => {
      const index = data.flashcards.findIndex((c) => c.id === cardId);
      if (index === -1) {
        return false;
      }
      data.flashcards.splice(index, 1);
      return true;
    });
  },

  async recordReview(input: {
    userId: string;
    cardId: string;
    rating: ReviewRating;
    mode?: StudyMode;
    sessionId?: string;
  }): Promise<{ card: Flashcard; session: StudySession }> {
    return mutate((data) => {
      const card = data.flashcards.find((c) => c.id === input.cardId);
      if (!card) {
        throw new Error('Card not found');
      }

      const deck = data.decks.find((d) => d.id === card.deckId);
      if (!deck || deck.userId !== input.userId) {
        throw new Error('Unauthorized card review');
      }

      const next = calculateNextReview(input.rating, {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
      });

      card.easeFactor = next.easeFactor;
      card.interval = next.interval;
      card.repetitions = next.repetitions;
      card.nextReviewAt = next.nextReviewAt;
      card.memoryScore = next.memoryScore;
      card.updatedAt = nowIso();

      let session =
        input.sessionId != null
          ? data.sessions.find((s) => s.id === input.sessionId)
          : undefined;

      if (!session) {
        session = {
          id: createId(),
          userId: input.userId,
          deckId: card.deckId,
          mode: input.mode ?? 'review',
          startedAt: nowIso(),
          cardsReviewed: 0,
          correctCount: 0,
          incorrectCount: 0,
          ratings: {},
        };
        data.sessions.push(session);
      }

      session.cardsReviewed += 1;
      session.ratings[input.rating] = (session.ratings[input.rating] ?? 0) + 1;

      if (input.rating === 'again' || input.rating === 'hard') {
        session.incorrectCount += 1;
      } else {
        session.correctCount += 1;
      }

      session.endedAt = nowIso();

      return { card, session };
    });
  },

  async getSessionsByUser(userId: string): Promise<StudySession[]> {
    const data = await ensureDb();
    return data.sessions.filter((s) => s.userId === userId);
  },

  async getStats(userId: string): Promise<Stats> {
    const data = await ensureDb();
    const decks = data.decks.filter((d) => d.userId === userId);
    const deckIds = new Set(decks.map((d) => d.id));
    const cards = data.flashcards.filter((c) => deckIds.has(c.deckId));
    const sessions = data.sessions.filter((s) => s.userId === userId);

    const cardsDueToday = cards.filter((c) => isDue(c.nextReviewAt)).length;
    const cardsLearned = cards.filter((c) => c.repetitions >= 2).length;

    const totalReviews = sessions.reduce((sum, s) => sum + s.cardsReviewed, 0);
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
    const accuracy =
      totalReviews === 0
        ? 0
        : Math.round((totalCorrect / totalReviews) * 1000) / 10;

    const averageMemoryScore =
      cards.length === 0
        ? 0
        : Math.round(
            cards.reduce((sum, c) => sum + c.memoryScore, 0) / cards.length,
          );

    const activityMap = new Map<string, DailyActivity>();
    for (const session of sessions) {
      const key = toDateKey(session.startedAt);
      const existing = activityMap.get(key) ?? {
        date: key,
        reviews: 0,
        studyMinutes: 0,
        accuracy: 0,
      };

      const durationMs =
        session.endedAt != null
          ? Math.max(
              0,
              new Date(session.endedAt).getTime() -
                new Date(session.startedAt).getTime(),
            )
          : 0;

      existing.reviews += session.cardsReviewed;
      existing.studyMinutes += Math.round(durationMs / 60_000);
      const sessionTotal = session.correctCount + session.incorrectCount;
      existing.accuracy =
        sessionTotal === 0
          ? existing.accuracy
          : Math.round((session.correctCount / sessionTotal) * 1000) / 10;

      activityMap.set(key, existing);
    }

    const dailyActivity = [...activityMap.values()].sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const studyStreak = computeStreak(dailyActivity.map((d) => d.date));
    const totalStudyMinutes = dailyActivity.reduce(
      (sum, d) => sum + d.studyMinutes,
      0,
    );

    const deckStats: DeckStats[] = decks.map((deck) => {
      const deckCards = cards.filter((c) => c.deckId === deck.id);
      const deckSessions = sessions.filter((s) => s.deckId === deck.id);
      const reviewed = deckSessions.reduce((s, x) => s + x.cardsReviewed, 0);
      const correct = deckSessions.reduce((s, x) => s + x.correctCount, 0);

      return {
        deckId: deck.id,
        totalCards: deckCards.length,
        dueCards: deckCards.filter((c) => isDue(c.nextReviewAt)).length,
        learnedCards: deckCards.filter((c) => c.repetitions >= 2).length,
        averageMemoryScore:
          deckCards.length === 0
            ? 0
            : Math.round(
                deckCards.reduce((sum, c) => sum + c.memoryScore, 0) /
                  deckCards.length,
              ),
        accuracy:
          reviewed === 0
            ? 0
            : Math.round((correct / reviewed) * 1000) / 10,
      };
    });

    return {
      userId,
      totalDecks: decks.length,
      totalCards: cards.length,
      cardsDueToday,
      cardsLearned,
      studyStreak,
      totalReviews,
      accuracy,
      averageMemoryScore,
      totalStudyMinutes,
      dailyActivity,
      deckStats,
    };
  },

  async verifyPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await store.findUserByEmail(email);
    if (!user || !compareSync(password, user.passwordHash)) {
      return null;
    }
    return user;
  },

  async updateProfile(
    userId: string,
    input: { name: string },
  ): Promise<PublicUser | null> {
    return mutate((data) => {
      const user = data.users.find((u) => u.id === userId);
      if (!user) {
        return null;
      }
      user.name = input.name.trim();
      return toPublicUser(user);
    });
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    return mutate((data) => {
      const user = data.users.find((u) => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (!compareSync(currentPassword, user.passwordHash)) {
        throw new Error('Current password is incorrect');
      }
      user.passwordHash = hashSync(newPassword, 10);
      return true;
    });
  },

  /**
   * Creates a password-reset token for local/demo use (no email).
   * Returns null when the email is unknown (caller should still return a generic message).
   */
  async createPasswordResetToken(
    email: string,
  ): Promise<{ token: string; expiresAt: string } | null> {
    return mutate((data) => {
      const normalized = email.trim().toLowerCase();
      const user = data.users.find((u) => u.email.toLowerCase() === normalized);
      if (!user) {
        return null;
      }

      const token = createId();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      user.resetToken = token;
      user.resetTokenExpiresAt = expiresAt;
      return { token, expiresAt };
    });
  },

  async resetPasswordWithToken(
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    return mutate((data) => {
      const user = data.users.find((u) => u.resetToken === token);
      if (!user || !user.resetTokenExpiresAt) {
        throw new Error('Invalid or expired reset token');
      }
      if (new Date(user.resetTokenExpiresAt).getTime() < Date.now()) {
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        throw new Error('Invalid or expired reset token');
      }

      user.passwordHash = hashSync(newPassword, 10);
      user.resetToken = undefined;
      user.resetTokenExpiresAt = undefined;
      return true;
    });
  },

  async deleteUser(userId: string): Promise<boolean> {
    return mutate((data) => {
      const index = data.users.findIndex((u) => u.id === userId);
      if (index === -1) {
        return false;
      }

      const deckIds = new Set(
        data.decks.filter((d) => d.userId === userId).map((d) => d.id),
      );

      data.users.splice(index, 1);
      data.decks = data.decks.filter((d) => d.userId !== userId);
      data.flashcards = data.flashcards.filter((c) => !deckIds.has(c.deckId));
      data.sessions = data.sessions.filter((s) => s.userId !== userId);
      return true;
    });
  },

  async updateSettings(
    userId: string,
    input: Partial<UserSettings>,
  ): Promise<UserSettings | null> {
    return mutate((data) => {
      const user = data.users.find((u) => u.id === userId);
      if (!user) {
        return null;
      }
      user.settings = { ...user.settings, ...input };
      return user.settings;
    });
  },

  async getSettings(userId: string): Promise<UserSettings | null> {
    const user = await store.findUserById(userId);
    return user?.settings ?? null;
  },

  async getDecksWithCounts(
    userId: string,
    filters?: {
      search?: string;
      archived?: boolean;
      favorite?: boolean;
      sort?: DeckSort;
      tag?: string;
    },
  ): Promise<DeckWithCounts[]> {
    const data = await ensureDb();
    let decks = data.decks.filter((d) => d.userId === userId);

    if (filters?.archived !== undefined) {
      decks = decks.filter((d) => d.isArchived === filters.archived);
    } else {
      decks = decks.filter((d) => !d.isArchived);
    }

    if (filters?.favorite !== undefined) {
      decks = decks.filter((d) => d.isFavorite === filters.favorite);
    }

    if (filters?.tag) {
      const tag = filters.tag.toLowerCase();
      decks = decks.filter((d) =>
        d.tags.some((t) => t.toLowerCase() === tag),
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      decks = decks.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    const withCounts: DeckWithCounts[] = decks.map((deck) => {
      const cards = data.flashcards.filter((c) => c.deckId === deck.id);
      return {
        ...deck,
        cardCount: cards.length,
        dueCount: cards.filter((c) => isDue(c.nextReviewAt)).length,
      };
    });

    const sort = filters?.sort ?? 'updatedAt';
    withCounts.sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return b.createdAt.localeCompare(a.createdAt);
        case 'cardCount':
          return b.cardCount - a.cardCount;
        case 'dueCount':
          return b.dueCount - a.dueCount;
        case 'updatedAt':
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });

    return withCounts;
  },

  async getDeckWithStats(
    deckId: string,
    userId: string,
  ): Promise<DeckWithStats | null> {
    const data = await ensureDb();
    const deck = data.decks.find((d) => d.id === deckId && d.userId === userId);
    if (!deck) {
      return null;
    }

    const stats = await store.getStats(userId);
    const deckStats = stats.deckStats.find((s) => s.deckId === deckId) ?? {
      deckId,
      totalCards: 0,
      dueCards: 0,
      learnedCards: 0,
      averageMemoryScore: 0,
      accuracy: 0,
    };

    return { ...deck, stats: deckStats };
  },

  async duplicateDeck(deckId: string, userId: string): Promise<Deck> {
    return mutate((data) => {
      const source = data.decks.find(
        (d) => d.id === deckId && d.userId === userId,
      );
      if (!source) {
        throw new Error('Deck not found');
      }

      const timestamp = nowIso();
      const newDeck: Deck = {
        ...source,
        id: createId(),
        title: `${source.title} (Copy)`,
        isFavorite: false,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      data.decks.push(newDeck);

      const sourceCards = data.flashcards.filter((c) => c.deckId === deckId);
      for (const card of sourceCards) {
        data.flashcards.push({
          ...card,
          id: createId(),
          deckId: newDeck.id,
          ...defaultCardFields({
            tags: [...card.tags],
            difficulty: card.difficulty,
          }),
          hint: card.hint,
          example: card.example,
          notes: card.notes,
          imageUrl: card.imageUrl,
          audioUrl: card.audioUrl,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      return newDeck;
    });
  },

  async toggleArchive(deckId: string, userId: string): Promise<Deck | null> {
    return mutate((data) => {
      const deck = data.decks.find(
        (d) => d.id === deckId && d.userId === userId,
      );
      if (!deck) {
        return null;
      }
      deck.isArchived = !deck.isArchived;
      deck.updatedAt = nowIso();
      return deck;
    });
  },

  async getCardsFiltered(
    deckId: string,
    filters?: {
      search?: string;
      tag?: string;
      difficulty?: Difficulty;
    },
  ): Promise<Flashcard[]> {
    const data = await ensureDb();
    let cards = data.flashcards.filter((c) => c.deckId === deckId);

    if (filters?.tag) {
      const tag = filters.tag.toLowerCase();
      cards = cards.filter((c) =>
        c.tags.some((t) => t.toLowerCase() === tag),
      );
    }

    if (filters?.difficulty) {
      cards = cards.filter((c) => c.difficulty === filters.difficulty);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.front.toLowerCase().includes(q) ||
          c.back.toLowerCase().includes(q) ||
          (c.hint?.toLowerCase().includes(q) ?? false) ||
          (c.notes?.toLowerCase().includes(q) ?? false) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return cards;
  },

  async importCards(
    deckId: string,
    cards: ExportFlashcard[],
  ): Promise<Flashcard[]> {
    return mutate((data) => {
      const deck = data.decks.find((d) => d.id === deckId);
      if (!deck) {
        throw new Error('Deck not found');
      }

      const timestamp = nowIso();
      const created: Flashcard[] = cards
        .filter((c) => c.front.trim() && c.back.trim())
        .map((input) => {
          const card: Flashcard = {
            id: createId(),
            deckId,
            front: input.front.trim(),
            back: input.back.trim(),
            hint: input.hint?.trim(),
            example: input.example?.trim(),
            notes: input.notes?.trim(),
            ...defaultCardFields({
              tags: input.tags ?? [],
              difficulty: input.difficulty ?? 'beginner',
            }),
            createdAt: timestamp,
            updatedAt: timestamp,
          };
          data.flashcards.push(card);
          return card;
        });

      deck.updatedAt = timestamp;
      return created;
    });
  },

  async getStudyCards(
    deckId: string,
    userId: string,
    mode: StudyMode = 'review',
  ): Promise<Flashcard[]> {
    const data = await ensureDb();
    const deck = data.decks.find((d) => d.id === deckId && d.userId === userId);
    if (!deck) {
      throw new Error('Deck not found');
    }

    const cards = data.flashcards.filter((c) => c.deckId === deckId);
    if (cards.length === 0) {
      return [];
    }

    switch (mode) {
      case 'review': {
        const due = cards.filter((c) => isDue(c.nextReviewAt));
        const notDue = cards.filter((c) => !isDue(c.nextReviewAt));
        due.sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
        return [...due, ...notDue];
      }
      case 'random':
        return shuffle([...cards]);
      case 'sequential':
        return [...cards].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case 'exam':
      case 'practice':
      case 'timed':
      default:
        return [...cards];
    }
  },

  async startSession(input: {
    userId: string;
    deckId: string;
    mode: StudyMode;
  }): Promise<StudySession> {
    return mutate((data) => {
      const deck = data.decks.find(
        (d) => d.id === input.deckId && d.userId === input.userId,
      );
      if (!deck) {
        throw new Error('Deck not found');
      }

      const session: StudySession = {
        id: createId(),
        userId: input.userId,
        deckId: input.deckId,
        mode: input.mode,
        startedAt: nowIso(),
        cardsReviewed: 0,
        correctCount: 0,
        incorrectCount: 0,
        ratings: {},
      };
      data.sessions.push(session);
      return session;
    });
  },

  async endSession(
    sessionId: string,
    userId: string,
    stats?: {
      cardsReviewed?: number;
      correctCount?: number;
      incorrectCount?: number;
      ratings?: Partial<Record<ReviewRating, number>>;
    },
  ): Promise<StudySession | null> {
    return mutate((data) => {
      const session = data.sessions.find(
        (s) => s.id === sessionId && s.userId === userId,
      );
      if (!session) {
        return null;
      }

      if (stats?.cardsReviewed !== undefined) {
        session.cardsReviewed = stats.cardsReviewed;
      }
      if (stats?.correctCount !== undefined) {
        session.correctCount = stats.correctCount;
      }
      if (stats?.incorrectCount !== undefined) {
        session.incorrectCount = stats.incorrectCount;
      }
      if (stats?.ratings !== undefined) {
        session.ratings = { ...session.ratings, ...stats.ratings };
      }
      session.endedAt = nowIso();
      return session;
    });
  },

  async toggleBookmark(
    cardId: string,
    userId: string,
  ): Promise<Flashcard | null> {
    return mutate((data) => {
      const card = data.flashcards.find((c) => c.id === cardId);
      if (!card) {
        return null;
      }
      const deck = data.decks.find((d) => d.id === card.deckId);
      if (!deck || deck.userId !== userId) {
        throw new Error('Unauthorized');
      }
      card.isBookmarked = !card.isBookmarked;
      card.updatedAt = nowIso();
      return card;
    });
  },

  async updateCardNotes(
    cardId: string,
    userId: string,
    notes: string,
  ): Promise<Flashcard | null> {
    return mutate((data) => {
      const card = data.flashcards.find((c) => c.id === cardId);
      if (!card) {
        return null;
      }
      const deck = data.decks.find((d) => d.id === card.deckId);
      if (!deck || deck.userId !== userId) {
        throw new Error('Unauthorized');
      }
      card.notes = notes.trim() || undefined;
      card.updatedAt = nowIso();
      return card;
    });
  },

  async assertDeckOwnership(
    deckId: string,
    userId: string,
  ): Promise<Deck | null> {
    const deck = await store.getDeckById(deckId);
    if (!deck || deck.userId !== userId) {
      return null;
    }
    return deck;
  },

  async assertCardOwnership(
    cardId: string,
    userId: string,
  ): Promise<Flashcard | null> {
    const data = await ensureDb();
    const card = data.flashcards.find((c) => c.id === cardId);
    if (!card) {
      return null;
    }
    const deck = data.decks.find((d) => d.id === card.deckId);
    if (!deck || deck.userId !== userId) {
      return null;
    }
    return card;
  },

  async search(
    userId: string,
    query: string,
  ): Promise<{ decks: Deck[]; cards: Flashcard[] }> {
    const data = await ensureDb();
    const q = query.trim().toLowerCase();
    if (!q) {
      return { decks: [], cards: [] };
    }

    const decks = data.decks.filter(
      (d) =>
        d.userId === userId &&
        (d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))),
    );

    const deckIds = new Set(
      data.decks.filter((d) => d.userId === userId).map((d) => d.id),
    );

    const cards = data.flashcards.filter(
      (c) =>
        deckIds.has(c.deckId) &&
        (c.front.toLowerCase().includes(q) ||
          c.back.toLowerCase().includes(q) ||
          (c.hint?.toLowerCase().includes(q) ?? false) ||
          (c.notes?.toLowerCase().includes(q) ?? false) ||
          c.tags.some((t) => t.toLowerCase().includes(q))),
    );

    return { decks, cards };
  },

  async getDailyActivity(userId: string): Promise<DailyActivity[]> {
    const stats = await store.getStats(userId);
    return stats.dailyActivity;
  },

  async exportUserData(userId: string): Promise<UserExportData> {
    const data = await ensureDb();
    const user = data.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const decks = data.decks.filter((d) => d.userId === userId);
    const deckIds = new Set(decks.map((d) => d.id));

    return {
      version: 1,
      exportedAt: nowIso(),
      user: toPublicUser(user),
      decks,
      flashcards: data.flashcards.filter((c) => deckIds.has(c.deckId)),
      sessions: data.sessions.filter((s) => s.userId === userId),
    };
  },

  async importUserData(
    userId: string,
    payload: {
      decks: Array<
        Pick<Deck, 'title'> & {
          description?: string;
          color?: string;
          tags?: string[];
          flashcards?: ExportFlashcard[];
        }
      >;
    },
  ): Promise<{ decksImported: number; cardsImported: number }> {
    return mutate((data) => {
      const user = data.users.find((u) => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      let decksImported = 0;
      let cardsImported = 0;
      const timestamp = nowIso();
      const incoming = payload.decks ?? [];

      for (const item of incoming) {
        const deck: Deck = {
          id: createId(),
          userId,
          title: item.title.trim(),
          description: item.description?.trim() ?? '',
          color: item.color ?? '#0D9488',
          tags: item.tags ?? [],
          isFavorite: false,
          isArchived: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        data.decks.push(deck);
        decksImported += 1;

        for (const cardInput of item.flashcards ?? []) {
          if (!cardInput.front?.trim() || !cardInput.back?.trim()) {
            continue;
          }
          data.flashcards.push({
            id: createId(),
            deckId: deck.id,
            front: cardInput.front.trim(),
            back: cardInput.back.trim(),
            hint: cardInput.hint?.trim(),
            example: cardInput.example?.trim(),
            notes: cardInput.notes?.trim(),
            ...defaultCardFields({
              tags: cardInput.tags ?? [],
              difficulty: cardInput.difficulty ?? 'beginner',
            }),
            createdAt: timestamp,
            updatedAt: timestamp,
          });
          cardsImported += 1;
        }
      }

      return { decksImported, cardsImported };
    });
  },
};

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = items[i] as T;
    items[i] = items[j] as T;
    items[j] = tmp;
  }
  return items;
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) {
    return 0;
  }

  const unique = [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  const today = toDateKey();
  let streak = 0;
  let cursor = new Date(`${today}T00:00:00.000Z`);

  if (unique[0] !== today) {
    const yesterday = new Date(cursor);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    if (unique[0] !== toDateKey(yesterday)) {
      return 0;
    }
    cursor = yesterday;
  }

  for (const date of unique) {
    if (date === toDateKey(cursor)) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export type { Database };
