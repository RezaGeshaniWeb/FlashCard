'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useRegister } from '@/features/auth/hooks/useAuth';
import type { RegisterFormValues } from '@/features/auth/types';
import { useT, type TranslateFn } from '@/i18n';

function createRegisterSchema(t: TranslateFn) {
  return z
    .object({
      name: z.string().trim().min(1, t('auth.nameRequired')).max(100),
      email: z.string().trim().email(t('auth.emailInvalid')),
      password: z.string().min(8, t('auth.passwordMin')),
      confirmPassword: z.string().min(1, t('auth.confirmRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const t = useT();
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    router.push(ROUTES.DASHBOARD);
    router.refresh();
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {t('auth.registerTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.registerSubtitle')}
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t('auth.name')}
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register('name')}
        />
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
          autoComplete="new-password"
          required
          showPasswordToggle
          hint={t('auth.passwordHint')}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label={t('auth.confirmPassword')}
          type="password"
          autoComplete="new-password"
          required
          showPasswordToggle
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button
          type="submit"
          loading={registerMutation.isPending}
          className="w-full"
        >
          {t('auth.createAccount')}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {t('auth.signIn')}
          </Link>
        </p>
      </form>
    </div>
  );
}
