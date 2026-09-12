'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { deckKeys } from '@/features/decks/hooks/useDecks';
import {
  flashcardService,
  type ImportCardsInput,
  type ImportCardsResult,
  type ListCardsParams,
} from '@/features/flashcards/services/flashcard-service';
import { useT } from '@/i18n';
import type {
  CreateFlashcardInput,
  Flashcard,
  UpdateFlashcardInput,
} from '@/types';

export const flashcardKeys = {
  all: ['flashcards'] as const,
  lists: () => [...flashcardKeys.all, 'list'] as const,
  list: (deckId: string, params?: ListCardsParams) =>
    [...flashcardKeys.lists(), deckId, params ?? {}] as const,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useFlashcards(
  deckId: string,
  params?: ListCardsParams,
): UseQueryResult<Flashcard[], Error> {
  return useQuery({
    queryKey: flashcardKeys.list(deckId, params),
    queryFn: () => flashcardService.listByDeck(deckId, params),
    enabled: Boolean(deckId),
  });
}

export function useCreateFlashcard(
  deckId: string,
): UseMutationResult<Flashcard, Error, CreateFlashcardInput> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (input: CreateFlashcardInput) =>
      flashcardService.create(deckId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: flashcardKeys.lists(),
      });
      void queryClient.invalidateQueries({ queryKey: deckKeys.all });
      toast.success(t('flashcards.created'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('flashcards.createFailed')));
    },
  });
}

export function useUpdateFlashcard(): UseMutationResult<
  Flashcard,
  Error,
  { id: string; input: UpdateFlashcardInput }
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: ({ id, input }) => flashcardService.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: flashcardKeys.lists(),
      });
      toast.success(t('flashcards.updated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('flashcards.updateFailed')));
    },
  });
}

export function useDeleteFlashcard(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (id: string) => flashcardService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: flashcardKeys.lists(),
      });
      void queryClient.invalidateQueries({ queryKey: deckKeys.all });
      toast.success(t('flashcards.deleted'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('flashcards.deleteFailed')));
    },
  });
}

export function useImportFlashcards(
  deckId: string,
): UseMutationResult<ImportCardsResult, Error, ImportCardsInput> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (input: ImportCardsInput) =>
      flashcardService.import(deckId, input),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: flashcardKeys.lists(),
      });
      void queryClient.invalidateQueries({ queryKey: deckKeys.all });
      toast.success(t('flashcards.imported', { count: result.imported }));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('flashcards.importFailed')));
    },
  });
}

export function useToggleBookmark(): UseMutationResult<
  Flashcard,
  Error,
  string
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (id: string) => flashcardService.toggleBookmark(id),
    onSuccess: (card) => {
      void queryClient.invalidateQueries({
        queryKey: flashcardKeys.lists(),
      });
      toast.success(
        card.isBookmarked
          ? t('flashcards.bookmarkedToast')
          : t('flashcards.bookmarkRemoved'),
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('flashcards.bookmarkFailed')));
    },
  });
}
