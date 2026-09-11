'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export interface ChangePasswordFormProps {
  onSubmit: (values: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function ChangePasswordForm({
  onSubmit,
  isSubmitting = false,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Use a strong password you do not reuse elsewhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex max-w-md flex-col gap-4"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            });
            reset();
          })}
          noValidate
        >
          <Input
            label="Current password"
            type="password"
            showPasswordToggle
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="New password"
            type="password"
            showPasswordToggle
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm new password"
            type="password"
            showPasswordToggle
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="w-fit">
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
