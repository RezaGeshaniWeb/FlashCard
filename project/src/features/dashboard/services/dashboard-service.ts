import apiClient from '@/services/api-client';
import type { ApiResponse, DeckWithCounts, Stats } from '@/types';

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const dashboardService = {
  async getStats(): Promise<Stats> {
    const res = await apiClient.get<ApiResponse<Stats>>('/stats');
    return unwrap(res);
  },

  async getRecentDecks(): Promise<DeckWithCounts[]> {
    const res = await apiClient.get<ApiResponse<DeckWithCounts[]>>('/decks', {
      params: { sort: 'updatedAt' },
    });
    return unwrap(res);
  },
};
