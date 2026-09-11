'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import type { ForgotPasswordFormValues } from '@/features/auth/types';

const forgotSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
});

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  const [resetToken, setResetToken] = useState<string | null>(null);

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
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        hint="We will prepare a reset token if an account exists (local demo)."
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" loading={forgot.isPending} className="w-full">
        Send reset link
      </Button>

      {resetToken ? (
        <div
          className="rounded-lg border border-border bg-muted/60 p-3 text-sm"
          role="status"
        >
          <p className="font-medium text-foreground">Reset ready</p>
          <p className="mt-1 text-muted-foreground">
            Use this one-time token to set a new password (demo — no email).
          </p>
          <Link
            href={`${ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(resetToken)}`}
            className="mt-3 inline-flex font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Continue to reset password
          </Link>
        </div>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
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
