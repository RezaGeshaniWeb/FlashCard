import apiClient from '@/services/api-client';
import type {
  ApiResponse,
  Flashcard,
  ReviewRating,
  StudyMode,
  StudySession,
} from '@/types';

export interface StudyCardsResponse {
  deckId: string;
  mode: StudyMode;
  cards: Flashcard[];
}

export interface ReviewInput {
  cardId: string;
  rating: ReviewRating;
  mode?: StudyMode;
  sessionId?: string;
}

export interface ReviewResult {
  card: Flashcard;
  session: StudySession;
}

export interface SessionInput {
  action: 'start' | 'end';
  mode?: StudyMode;
  sessionId?: string;
  stats?: {
    cardsReviewed?: number;
    correctCount?: number;
    incorrectCount?: number;
    ratings?: Partial<Record<ReviewRating, number>>;
  };
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const studyService = {
  async getCards(
    deckId: string,
    mode?: StudyMode,
  ): Promise<StudyCardsResponse> {
    const res = await apiClient.get<ApiResponse<StudyCardsResponse>>(
      `/study/${deckId}`,
      { params: { mode } },
    );
    return unwrap(res);
  },

  async review(deckId: string, input: ReviewInput): Promise<ReviewResult> {
    const res = await apiClient.post<ApiResponse<ReviewResult>>(
      `/study/${deckId}/review`,
      input,
    );
    return unwrap(res);
  },

  async session(
    deckId: string,
    input: SessionInput,
  ): Promise<StudySession> {
    const res = await apiClient.post<ApiResponse<StudySession>>(
      `/study/${deckId}/session`,
      input,
    );
    return unwrap(res);
  },

  async toggleBookmark(cardId: string): Promise<Flashcard> {
    const res = await apiClient.patch<ApiResponse<Flashcard>>(
      `/cards/${cardId}/bookmark`,
    );
    return unwrap(res);
  },

  async updateNotes(cardId: string, notes: string): Promise<Flashcard> {
    const res = await apiClient.patch<ApiResponse<Flashcard>>(
      `/cards/${cardId}/notes`,
      { notes },
    );
    return unwrap(res);
  },
};
