'use client';

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

const resetSchema = z
  .object({
    token: z.string().trim().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') ?? '';
  const reset = useResetPassword();

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
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Reset token"
        autoComplete="off"
        required
        hint="Paste the token from the forgot-password response if it is not in the URL."
        error={errors.token?.message}
        {...register('token')}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" loading={reset.isPending} className="w-full">
        Update password
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
