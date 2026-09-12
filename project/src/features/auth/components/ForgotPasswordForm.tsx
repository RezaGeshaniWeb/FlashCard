'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import type { ForgotPasswordFormValues } from '@/features/auth/types';
import { useT, type TranslateFn } from '@/i18n';

function createForgotSchema(t: TranslateFn) {
  return z.object({
    email: z.string().trim().email(t('auth.emailInvalid')),
  });
}

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const t = useT();
  const forgotSchema = useMemo(() => createForgotSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await forgot.mutateAsync(values.email);
    setResetToken(result.resetToken ?? null);
    reset();
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {t('auth.forgotTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.forgotSubtitle')}
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          hint={t('auth.emailHintDemo')}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" loading={forgot.isPending} className="w-full">
          {t('auth.sendResetLink')}
        </Button>

        {resetToken ? (
          <div
            className="rounded-lg border border-border bg-muted/60 p-3 text-sm"
            role="status"
          >
            <p className="font-medium text-foreground">
              {t('auth.resetReadyTitle')}
            </p>
            <p className="mt-1 text-muted-foreground">
              {t('auth.resetReadyBody')}
            </p>
            <Link
              href={`${ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(resetToken)}`}
              className="mt-3 inline-flex font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {t('auth.continueReset')}
            </Link>
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.remembered')}{' '}
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
