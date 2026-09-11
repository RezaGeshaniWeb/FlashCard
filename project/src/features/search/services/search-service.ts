import apiClient from '@/services/api-client';
import type { ApiResponse, Deck, Flashcard } from '@/types';

export interface SearchResults {
  decks: Deck[];
  cards: Flashcard[];
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const searchService = {
  async search(q: string): Promise<SearchResults> {
    const res = await apiClient.get<ApiResponse<SearchResults>>('/search', {
      params: { q },
    });
    return unwrap(res);
  },
};
