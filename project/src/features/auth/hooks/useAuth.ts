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
import { useT } from '@/i18n';
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
  const t = useT();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success(t('auth.welcomeBack'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.loginFailed')));
    },
  });
}

export function useRegister(): UseMutationResult<
  PublicUser,
  Error,
  RegisterInput
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success(t('auth.accountCreated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.registrationFailed')));
    },
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success(t('auth.signedOut'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.logoutFailed')));
    },
  });
}

export function useForgotPassword(): UseMutationResult<
  { message?: string; resetToken?: string },
  Error,
  string
> {
  const t = useT();

  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (result) => {
      toast.success(result.message ?? t('auth.resetSuccessFallback'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.resetStartFailed')));
    },
  });
}

export function useResetPassword(): UseMutationResult<
  void,
  Error,
  { token: string; password: string }
> {
  const t = useT();

  return useMutation({
    mutationFn: (input) => authService.resetPassword(input),
    onSuccess: () => {
      toast.success(t('auth.passwordUpdated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.resetFailed')));
    },
  });
}

export function useUpdateProfile(): UseMutationResult<
  PublicUser,
  Error,
  UpdateProfileInput
> {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      toast.success(t('auth.profileUpdated'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.profileUpdateFailed')));
    },
  });
}

export function useChangePassword(): UseMutationResult<
  void,
  Error,
  ChangePasswordInput
> {
  const t = useT();

  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      authService.changePassword(input),
    onSuccess: () => {
      toast.success(t('auth.passwordChanged'));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t('auth.passwordChangeFailed')));
    },
  });
}
