'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useLogin } from '@/features/auth/hooks/useAuth';
import type { LoginFormValues } from '@/features/auth/types';
import { useT, type TranslateFn } from '@/i18n';

function createLoginSchema(t: TranslateFn) {
  return z.object({
    email: z.string().trim().email(t('auth.emailInvalid')),
    password: z.string().min(1, t('auth.passwordRequired')),
    rememberMe: z.boolean(),
  });
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const t = useT();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    const next = searchParams.get('next');
    router.push(next && next.startsWith('/') ? next : ROUTES.DASHBOARD);
    router.refresh();
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('auth.loginSubtitle')}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          required
          showPasswordToggle
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex items-center justify-between gap-3">
          <Checkbox label={t('auth.rememberMe')} {...register('rememberMe')} />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <Button type="submit" loading={login.isPending} className="w-full">
          {t('auth.signIn')}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {t('auth.createOne')}
          </Link>
        </p>
      </form>
    </div>
  );
}
