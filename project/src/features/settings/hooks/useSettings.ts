'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { PublicUser, UserSettings } from '@/types';
import { settingsService, type ImportDataInput } from '../services/settings-service';
import {
  authService,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from '@/features/auth/services/auth-service';
import { ROUTES } from '@/constants';

export const settingsKeys = {
  all: ['settings'] as const,
  settings: () => [...settingsKeys.all, 'user-settings'] as const,
  me: () => [...settingsKeys.all, 'me'] as const,
};

export function useSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: settingsKeys.settings(),
    queryFn: () => settingsService.get(),
  });

  const meQuery = useQuery({
    queryKey: settingsKeys.me(),
    queryFn: () => authService.me(),
  });

  const updateSettings = useMutation({
    mutationFn: (input: Partial<UserSettings>) => settingsService.update(input),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.settings(), data);
      toast.success('Settings saved');
    },
    onError: () => toast.error('Could not save settings'),
  });

  const updateProfile = useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user: PublicUser) => {
      queryClient.setQueryData(settingsKeys.me(), user);
      toast.success('Profile updated');
    },
    onError: () => toast.error('Could not update profile'),
  });

  const changePassword = useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      authService.changePassword(input),
    onSuccess: () => toast.success('Password changed'),
    onError: () => toast.error('Could not change password'),
  });

  const deleteAccount = useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted');
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
      router.refresh();
    },
    onError: () => toast.error('Could not delete account'),
  });

  const exportData = useMutation({
    mutationFn: () => settingsService.exportData(),
    onError: () => toast.error('Export failed'),
  });

  const importData = useMutation({
    mutationFn: (input: ImportDataInput) => settingsService.importData(input),
    onSuccess: (result) => {
      toast.success(
        `Imported ${result.decksImported} decks and ${result.cardsImported} cards`,
      );
      void queryClient.invalidateQueries();
    },
    onError: () => toast.error('Import failed'),
  });

  return {
    settings: settingsQuery.data,
    user: meQuery.data,
    isLoading: settingsQuery.isLoading || meQuery.isLoading,
    isError: settingsQuery.isError || meQuery.isError,
    refetch: () => {
      void settingsQuery.refetch();
      void meQuery.refetch();
    },
    updateSettings,
    updateProfile,
    changePassword,
    deleteAccount,
    exportData,
    importData,
  };
}
