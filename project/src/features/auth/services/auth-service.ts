import apiClient from '@/services/api-client';
import type { ApiResponse, PublicUser } from '@/types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    const res = await apiClient.post<ApiResponse<PublicUser>>(
      '/auth/register',
      input,
    );
    return unwrap(res);
  },

  async login(input: LoginInput): Promise<PublicUser> {
    const res = await apiClient.post<ApiResponse<PublicUser>>(
      '/auth/login',
      input,
    );
    return unwrap(res);
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<{ ok: boolean }>>('/auth/logout');
  },

  async forgotPassword(email: string): Promise<{
    message?: string;
    resetToken?: string;
  }> {
    const res = await apiClient.post<
      ApiResponse<{ sent: boolean; resetToken?: string; expiresAt?: string }>
    >('/auth/forgot-password', { email });
    return {
      message: res.data.message,
      resetToken: res.data.data?.resetToken,
    };
  },

  async resetPassword(input: {
    token: string;
    password: string;
  }): Promise<void> {
    await apiClient.post<ApiResponse<{ ok: boolean }>>(
      '/auth/reset-password',
      input,
    );
  },

  async me(): Promise<PublicUser> {
    const res = await apiClient.get<ApiResponse<PublicUser>>('/auth/me');
    return unwrap(res);
  },

  async updateProfile(input: UpdateProfileInput): Promise<PublicUser> {
    const res = await apiClient.patch<ApiResponse<PublicUser>>(
      '/auth/profile',
      input,
    );
    return unwrap(res);
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await apiClient.post<ApiResponse<{ ok: boolean }>>(
      '/auth/change-password',
      input,
    );
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete<ApiResponse<{ ok: boolean }>>('/auth/account');
  },
};
