'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettings } from '../hooks/useSettings';
import { ChangePasswordForm } from './ChangePasswordForm';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/dates';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileView() {
  const {
    user,
    isLoading,
    isError,
    refetch,
    updateProfile,
    changePassword,
  } = useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return <ErrorState title="Could not load profile" onRetry={refetch} />;
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and password.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              {user.email} · Joined {formatDate(user.createdAt)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleSubmit((values) =>
              updateProfile.mutateAsync(values),
            )}
            noValidate
          >
            <Input
              label="Display name"
              error={errors.name?.message}
              autoComplete="name"
              {...register('name')}
            />
            <Input
              label="Email"
              value={user.email}
              disabled
              readOnly
              hint="Email cannot be changed in this version"
            />
            <Button
              type="submit"
              loading={updateProfile.isPending}
              disabled={!isDirty}
              className="w-fit"
            >
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <ChangePasswordForm
        isSubmitting={changePassword.isPending}
        onSubmit={(values) => changePassword.mutateAsync(values)}
      />
    </div>
  );
}
