'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Flashcard, ReviewRating, StudyMode } from '@/types';
import { useT } from '@/i18n';
import { studyService } from '../services/study-service';
import { isCorrectRating, shuffleCards } from '../utils/study-helpers';

export const studyKeys = {
  all: ['study'] as const,
  cards: (deckId: string, mode: StudyMode) =>
    [...studyKeys.all, deckId, mode] as const,
};

export type StudyOrder = 'sequential' | 'random';

export interface UseStudySessionOptions {
  deckId: string;
  mode: StudyMode;
  order: StudyOrder;
  timedSeconds?: number;
}

export interface StudySessionStats {
  reviewed: number;
  correct: number;
  incorrect: number;
  ratings: Partial<Record<ReviewRating, number>>;
}

const EMPTY_STATS: StudySessionStats = {
  reviewed: 0,
  correct: 0,
  incorrect: 0,
  ratings: {},
};

export function useStudySession({
  deckId,
  mode,
  order,
  timedSeconds = 0,
}: UseStudySessionOptions) {
  const t = useT();
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<'study' | 'complete' | 'retry'>('study');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<StudySessionStats>(EMPTY_STATS);
  const [secondsLeft, setSecondsLeft] = useState(timedSeconds);
  const [shuffled, setShuffled] = useState(order === 'random');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const cardsQuery = useQuery({
    queryKey: studyKeys.cards(deckId, mode),
    queryFn: () => studyService.getCards(deckId, mode),
  });

  useEffect(() => {
    if (!cardsQuery.data) return;
    const cards =
      shuffled || order === 'random'
        ? shuffleCards(cardsQuery.data.cards)
        : cardsQuery.data.cards;
    // Sync server query into the mutable study queue (shuffle/retry mutate local state).
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate queue from query */
    setQueue(cards);
    setIndex(0);
    setFlipped(false);
    setPhase('study');
    setIncorrectIds([]);
    setStats(EMPTY_STATS);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cardsQuery.data, shuffled, order]);

  useEffect(() => {
    if (!cardsQuery.data || startedRef.current) return;
    startedRef.current = true;
    void studyService
      .session(deckId, { action: 'start', mode })
      .then((session) => setSessionId(session.id))
      .catch(() => toast.error(t('study.startFailed')));
  }, [cardsQuery.data, deckId, mode, t]);

  useEffect(() => {
    if (mode !== 'timed' || timedSeconds <= 0 || phase !== 'study') return;
    /* eslint-disable react-hooks/set-state-in-effect -- reset timer when timed mode starts */
    setSecondsLeft(timedSeconds);
    /* eslint-enable react-hooks/set-state-in-effect */
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('complete');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, timedSeconds, phase, queue.length]);

  const currentCard = queue[index] ?? null;
  const isLast = index >= queue.length - 1;
  const progress = {
    current: Math.min(index + 1, queue.length),
    total: queue.length,
  };

  const endSession = useCallback(
    async (finalStats: StudySessionStats) => {
      if (!sessionId) return;
      try {
        await studyService.session(deckId, {
          action: 'end',
          sessionId,
          mode,
          stats: {
            cardsReviewed: finalStats.reviewed,
            correctCount: finalStats.correct,
            incorrectCount: finalStats.incorrect,
            ratings: finalStats.ratings,
          },
        });
      } catch {
        /* best-effort */
      }
    },
    [deckId, mode, sessionId],
  );

  const reviewMutation = useMutation({
    mutationFn: (input: { cardId: string; rating: ReviewRating }) =>
      studyService.review(deckId, {
        ...input,
        mode,
        sessionId: sessionId ?? undefined,
      }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: (cardId: string) => studyService.toggleBookmark(cardId),
    onSuccess: (card) => {
      setQueue((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, isBookmarked: card.isBookmarked } : c,
        ),
      );
      toast.success(
        card.isBookmarked
          ? t('flashcards.bookmarkedToast')
          : t('flashcards.bookmarkRemoved'),
      );
    },
    onError: () => toast.error(t('flashcards.bookmarkFailed')),
  });

  const notesMutation = useMutation({
    mutationFn: (input: { cardId: string; notes: string }) =>
      studyService.updateNotes(input.cardId, input.notes),
    onSuccess: (card) => {
      setQueue((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, notes: card.notes } : c)),
      );
      toast.success(t('study.notesSaved'));
    },
    onError: () => toast.error(t('study.notesFailed')),
  });

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const rate = useCallback(
    async (rating: ReviewRating) => {
      if (!currentCard || (phase !== 'study' && phase !== 'retry')) return;
      if (mode !== 'exam' && !flipped) {
        setFlipped(true);
        return;
      }

      const ok = isCorrectRating(rating);
      const nextStats: StudySessionStats = {
        reviewed: stats.reviewed + 1,
        correct: stats.correct + (ok ? 1 : 0),
        incorrect: stats.incorrect + (ok ? 0 : 1),
        ratings: {
          ...stats.ratings,
          [rating]: (stats.ratings[rating] ?? 0) + 1,
        },
      };
      setStats(nextStats);
      if (!ok) {
        setIncorrectIds((ids) =>
          ids.includes(currentCard.id) ? ids : [...ids, currentCard.id],
        );
      }

      try {
        await reviewMutation.mutateAsync({
          cardId: currentCard.id,
          rating,
        });
      } catch {
        toast.error(t('study.reviewFailed'));
      }

      setFlipped(false);
      if (isLast) {
        setPhase('complete');
        void endSession(nextStats);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [
      currentCard,
      phase,
      mode,
      flipped,
      stats,
      isLast,
      reviewMutation,
      endSession,
      t,
    ],
  );

  const toggleBookmark = useCallback(() => {
    if (currentCard) bookmarkMutation.mutate(currentCard.id);
  }, [currentCard, bookmarkMutation]);

  const saveNotes = useCallback(
    async (notes: string) => {
      if (!currentCard) return;
      await notesMutation.mutateAsync({ cardId: currentCard.id, notes });
    },
    [currentCard, notesMutation],
  );

  const shuffleQueue = useCallback(() => {
    setShuffled(true);
    setQueue((q) => shuffleCards(q));
    setIndex(0);
    setFlipped(false);
    toast.message(t('study.shuffled'));
  }, [t]);

  const retryIncorrect = useCallback(() => {
    const retryCards = queue.filter((c) => incorrectIds.includes(c.id));
    if (retryCards.length === 0) {
      toast.message(t('study.noIncorrectRetry'));
      return;
    }
    setQueue(retryCards);
    setIndex(0);
    setFlipped(false);
    setIncorrectIds([]);
    setPhase('retry');
    setStats(EMPTY_STATS);
  }, [queue, incorrectIds, t]);

  const restart = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: studyKeys.cards(deckId, mode),
    });
    startedRef.current = false;
    setPhase('study');
  }, [queryClient, deckId, mode]);

  return useMemo(
    () => ({
      isLoading: cardsQuery.isLoading,
      isError: cardsQuery.isError,
      refetch: () => void cardsQuery.refetch(),
      currentCard,
      flipped,
      flip,
      rate,
      toggleBookmark,
      saveNotes,
      shuffleQueue,
      retryIncorrect,
      restart,
      progress,
      stats,
      phase,
      secondsLeft,
      incorrectCount: incorrectIds.length,
      isRating: reviewMutation.isPending,
      isSavingNotes: notesMutation.isPending,
      mode,
      order: shuffled ? ('random' as const) : ('sequential' as const),
    }),
    [
      cardsQuery,
      currentCard,
      flipped,
      flip,
      rate,
      toggleBookmark,
      saveNotes,
      shuffleQueue,
      retryIncorrect,
      restart,
      progress,
      stats,
      phase,
      secondsLeft,
      incorrectIds.length,
      reviewMutation.isPending,
      notesMutation.isPending,
      mode,
      shuffled,
    ],
  );
}
