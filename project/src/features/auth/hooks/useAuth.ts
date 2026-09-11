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
  authService,
  type ChangePasswordInput,
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
} from '@/features/auth/services/auth-service';
import type { PublicUser } from '@/types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useMe(): UseQueryResult<PublicUser, Error> {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.me(),
    retry: false,
  });
}

export function useLogin(): UseMutationResult<PublicUser, Error, LoginInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success('Welcome back');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Login failed'));
    },
  });
}

export function useRegister(): UseMutationResult<
  PublicUser,
  Error,
  RegisterInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success('Account created');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Registration failed'));
    },
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Signed out');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Logout failed'));
    },
  });
}

export function useForgotPassword(): UseMutationResult<
  { message?: string; resetToken?: string },
  Error,
  string
> {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (result) => {
      toast.success(
        result.message ?? 'If that email exists, reset instructions are ready',
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not start password reset'));
    },
  });
}

export function useResetPassword(): UseMutationResult<
  void,
  Error,
  { token: string; password: string }
> {
  return useMutation({
    mutationFn: (input) => authService.resetPassword(input),
    onSuccess: () => {
      toast.success('Password updated — you can sign in now');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not reset password'));
    },
  });
}

export function useUpdateProfile(): UseMutationResult<
  PublicUser,
  Error,
  UpdateProfileInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success('Profile updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not update profile'));
    },
  });
}

export function useChangePassword(): UseMutationResult<
  void,
  Error,
  ChangePasswordInput
> {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      authService.changePassword(input),
    onSuccess: () => {
      toast.success('Password changed');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not change password'));
    },
  });
}
