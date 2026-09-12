'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  deckService,
  type ListDecksParams,
} from '@/features/decks/services/deck-service';
import { useT } from '@/i18n';
import type {
  CreateDeckInput,
  Deck,
  DeckWithCounts,
  DeckWithStats,
  UpdateDeckInput,
} from '@/types';

export const deckKeys = {
  all: ['decks'] as const,
  lists: () => [...deckKeys.all, 'list'] as const,
  list: (params?: ListDecksParams) =>
    [...deckKeys.lists(), params ?? {}] as const,
  details: () => [...deckKeys.all, 'detail'] as const,
  detail: (id: string) => [...deckKeys.details(), id] as const,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function invalidateDeckQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: deckKeys.all });
}

export function useDecks(
  params?: ListDecksParams,
): UseQueryResult<DeckWithCounts[], Error> {
  return useQuery({
    queryKey: deckKeys.list(params),
    queryFn: () => deckService.list(params),
  });
}

export function useDeck(
  id: string,
): UseQueryResult<DeckWithStats, Error> {
  return useQuery({
    queryKey: deckKeys.detail(id),
    queryFn: () => deckService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateDeck(): UseMutationResult<
  Deck,
  Error,
  CreateDeckInput
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (input: CreateDeckInput) => deckService.create(input),
    onSuccess: () => {
      invalidateDeckQueries(queryClient);
      toast.success(t('decks.created'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.createFailed')));
    },
  });
}

export function useUpdateDeck(): UseMutationResult<
  Deck,
  Error,
  { id: string; input: UpdateDeckInput }
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: ({ id, input }) => deckService.update(id, input),
    onSuccess: (deck) => {
      invalidateDeckQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: deckKeys.detail(deck.id),
      });
      toast.success(t('decks.updated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.updateFailed')));
    },
  });
}

export function useDeleteDeck(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (id: string) => deckService.remove(id),
    onSuccess: () => {
      invalidateDeckQueries(queryClient);
      toast.success(t('decks.deleted'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.deleteFailed')));
    },
  });
}

export function useArchiveDeck(): UseMutationResult<Deck, Error, string> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (id: string) => deckService.toggleArchive(id),
    onSuccess: (deck) => {
      invalidateDeckQueries(queryClient);
      toast.success(
        deck.isArchived ? t('decks.archivedToast') : t('decks.restored'),
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.archiveFailed')));
    },
  });
}

export function useDuplicateDeck(): UseMutationResult<Deck, Error, string> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (id: string) => deckService.duplicate(id),
    onSuccess: () => {
      invalidateDeckQueries(queryClient);
      toast.success(t('decks.duplicated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.duplicateFailed')));
    },
  });
}

export function useFavoriteDeck(): UseMutationResult<
  Deck,
  Error,
  { id: string; isFavorite: boolean }
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: ({ id, isFavorite }) =>
      deckService.update(id, { isFavorite }),
    onSuccess: (deck) => {
      invalidateDeckQueries(queryClient);
      toast.success(
        deck.isFavorite ? t('decks.favorited') : t('decks.unfavorited'),
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('decks.favoriteFailed')));
    },
  });
}
