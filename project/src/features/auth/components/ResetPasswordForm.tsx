'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import type { ResetPasswordFormValues } from '@/features/auth/types';
import { useT, type TranslateFn } from '@/i18n';

function createResetSchema(t: TranslateFn) {
  return z
    .object({
      token: z.string().trim().min(1, t('auth.tokenRequired')),
      password: z.string().min(8, t('auth.passwordMin')),
      confirmPassword: z.string().min(1, t('auth.confirmRequired')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') ?? '';
  const reset = useResetPassword();
  const t = useT();
  const resetSchema = useMemo(() => createResetSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: tokenFromQuery,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await reset.mutateAsync({
      token: values.token,
      password: values.password,
    });
    router.push(ROUTES.LOGIN);
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('auth.resetTitle')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('auth.resetSubtitle')}
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t('auth.resetToken')}
          autoComplete="off"
          required
          hint={t('auth.resetTokenHint')}
          error={errors.token?.message}
          {...register('token')}
        />
        <Input
          label={t('auth.newPassword')}
          type="password"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label={t('auth.confirmPassword')}
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={reset.isPending} className="w-full">
          {t('auth.updatePassword')}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {t('auth.backToSignIn')}
          </Link>
        </p>
      </form>
    </div>
  );
}
