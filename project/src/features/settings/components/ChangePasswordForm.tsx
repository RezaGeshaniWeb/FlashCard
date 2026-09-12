'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useT, type TranslateFn } from '@/i18n';

function createPasswordSchema(t: TranslateFn) {
  return z
    .object({
      currentPassword: z.string().min(1, t('settings.currentRequired')),
      newPassword: z.string().min(8, t('settings.newMin')),
      confirmPassword: z.string().min(1, t('settings.confirmNewRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('settings.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

type FormValues = z.infer<ReturnType<typeof createPasswordSchema>>;

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
  const t = useT();
  const schema = useMemo(() => createPasswordSchema(t), [t]);

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
        <CardTitle>{t('settings.changePasswordTitle')}</CardTitle>
        <CardDescription>
          {t('settings.changePasswordDescription')}
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
            label={t('settings.currentPassword')}
            type="password"
            showPasswordToggle
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label={t('settings.newPassword')}
            type="password"
            showPasswordToggle
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label={t('settings.confirmNewPassword')}
            type="password"
            showPasswordToggle
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="w-fit">
            {t('settings.updatePassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
