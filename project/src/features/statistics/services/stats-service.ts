import apiClient from '@/services/api-client';
import type { ApiResponse, DailyActivity, Stats } from '@/types';

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const statsService = {
  async getStats(): Promise<Stats> {
    const res = await apiClient.get<ApiResponse<Stats>>('/stats');
    return unwrap(res);
  },

  async getActivity(): Promise<DailyActivity[]> {
    const res = await apiClient.get<ApiResponse<DailyActivity[]>>(
      '/stats/activity',
    );
    return unwrap(res);
  },
};
