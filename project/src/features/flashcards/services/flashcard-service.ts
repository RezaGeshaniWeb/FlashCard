import apiClient from '@/services/api-client';
import type {
  ApiResponse,
  CreateFlashcardInput,
  Difficulty,
  Flashcard,
  UpdateFlashcardInput,
} from '@/types';

export interface ListCardsParams {
  search?: string;
  tag?: string;
  difficulty?: Difficulty;
}

export interface ImportCardsInput {
  format: 'csv' | 'json' | 'markdown';
  content: string;
}

export interface ImportCardsResult {
  cards: Flashcard[];
  imported: number;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const flashcardService = {
  async listByDeck(
    deckId: string,
    params?: ListCardsParams,
  ): Promise<Flashcard[]> {
    const res = await apiClient.get<ApiResponse<Flashcard[]>>(
      `/decks/${deckId}/cards`,
      { params },
    );
    return unwrap(res);
  },

  async create(
    deckId: string,
    input: CreateFlashcardInput,
  ): Promise<Flashcard> {
    const res = await apiClient.post<ApiResponse<Flashcard>>(
      `/decks/${deckId}/cards`,
      input,
    );
    return unwrap(res);
  },

  async update(id: string, input: UpdateFlashcardInput): Promise<Flashcard> {
    const res = await apiClient.patch<ApiResponse<Flashcard>>(
      `/cards/${id}`,
      input,
    );
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ ok: boolean }>>(`/cards/${id}`);
  },

  async import(
    deckId: string,
    input: ImportCardsInput,
  ): Promise<ImportCardsResult> {
    const res = await apiClient.post<ApiResponse<ImportCardsResult>>(
      `/decks/${deckId}/cards/import`,
      input,
    );
    return unwrap(res);
  },
  async toggleBookmark(id: string): Promise<Flashcard> {
    const res = await apiClient.patch<ApiResponse<Flashcard>>(
      `/cards/${id}/bookmark`,
    );
    return unwrap(res);
  },
};
