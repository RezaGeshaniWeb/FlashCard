import apiClient from '@/services/api-client';
import type {
  ApiResponse,
  UserExportData,
  UserSettings,
} from '@/types';

export interface ImportDataInput {
  decks: Array<{
    title: string;
    description?: string;
    color?: string;
    tags?: string[];
    flashcards?: Array<{
      front: string;
      back: string;
      hint?: string;
      example?: string;
      tags?: string[];
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      notes?: string;
    }>;
  }>;
}

export interface ImportDataResult {
  decksImported: number;
  cardsImported: number;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const settingsService = {
  async get(): Promise<UserSettings> {
    const res = await apiClient.get<ApiResponse<UserSettings>>('/settings');
    return unwrap(res);
  },

  async update(input: Partial<UserSettings>): Promise<UserSettings> {
    const res = await apiClient.patch<ApiResponse<UserSettings>>(
      '/settings',
      input,
    );
    return unwrap(res);
  },

  async exportData(): Promise<UserExportData> {
    const res = await apiClient.get<ApiResponse<UserExportData>>(
      '/settings/export',
    );
    return unwrap(res);
  },

  async importData(input: ImportDataInput): Promise<ImportDataResult> {
    const res = await apiClient.post<ApiResponse<ImportDataResult>>(
      '/settings/import',
      input,
    );
    return unwrap(res);
  },
};
