import apiClient from '@/services/api-client';
import type {
  ApiResponse,
  CreateDeckInput,
  Deck,
  DeckSort,
  DeckWithCounts,
  DeckWithStats,
  UpdateDeckInput,
} from '@/types';

export interface ListDecksParams {
  search?: string;
  archived?: boolean;
  favorite?: boolean;
  sort?: DeckSort;
  tag?: string;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const deckService = {
  async list(params?: ListDecksParams): Promise<DeckWithCounts[]> {
    const res = await apiClient.get<ApiResponse<DeckWithCounts[]>>('/decks', {
      params: {
        search: params?.search,
        archived:
          params?.archived === undefined
            ? undefined
            : String(params.archived),
        favorite:
          params?.favorite === undefined
            ? undefined
            : String(params.favorite),
        sort: params?.sort,
        tag: params?.tag,
      },
    });
    return unwrap(res);
  },

  async create(input: CreateDeckInput): Promise<Deck> {
    const res = await apiClient.post<ApiResponse<Deck>>('/decks', input);
    return unwrap(res);
  },

  async getById(id: string): Promise<DeckWithStats> {
    const res = await apiClient.get<ApiResponse<DeckWithStats>>(
      `/decks/${id}`,
    );
    return unwrap(res);
  },

  async update(id: string, input: UpdateDeckInput): Promise<Deck> {
    const res = await apiClient.patch<ApiResponse<Deck>>(
      `/decks/${id}`,
      input,
    );
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ ok: boolean }>>(`/decks/${id}`);
  },

  async duplicate(id: string): Promise<Deck> {
    const res = await apiClient.post<ApiResponse<Deck>>(
      `/decks/${id}/duplicate`,
    );
    return unwrap(res);
  },

  async toggleArchive(id: string): Promise<Deck> {
    const res = await apiClient.post<ApiResponse<Deck>>(
      `/decks/${id}/archive`,
    );
    return unwrap(res);
  },
};
