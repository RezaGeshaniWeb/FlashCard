import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';

import { getSession, type SessionUser } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export class ApiHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
  }
}

export function jsonOk<T>(
  data: T,
  status = 200,
  message?: string,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
    },
    { status },
  );
}

export function jsonError(
  message: string,
  status: number,
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: message,
      message,
    },
    { status },
  );
}

/** Requires an authenticated session; throws ApiHttpError(401) when missing. */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new ApiHttpError('Unauthorized', 401);
  }
  return session;
}

export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new ApiHttpError('Invalid JSON body', 400);
  }

  try {
    return schema.parse(json);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors.map((e) => e.message).join('; ');
      throw new ApiHttpError(message || 'Validation failed', 400);
    }
    throw error;
  }
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof ApiHttpError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    const message = error.errors.map((e) => e.message).join('; ');
    return jsonError(message || 'Validation failed', 400);
  }

  if (error instanceof Error) {
    const knownClientMessages = [
      'Email already registered',
      'Deck not found',
      'Card not found',
      'User not found',
      'Session not found',
      'Current password is incorrect',
      'Unauthorized',
      'Unauthorized card review',
      'Invalid email or password',
      'Invalid or expired reset token',
    ];

    if (knownClientMessages.includes(error.message)) {
      const status =
        error.message === 'Unauthorized' ||
        error.message === 'Unauthorized card review' ||
        error.message === 'Invalid email or password'
          ? error.message === 'Invalid email or password'
            ? 401
            : 403
          : error.message.includes('not found')
            ? 404
            : 400;
      return jsonError(error.message, status);
    }

    console.error('[api]', error);
    return jsonError('Internal server error', 500);
  }

  console.error('[api]', error);
  return jsonError('Internal server error', 500);
}

export function parseBooleanParam(
  value: string | null,
): boolean | undefined {
  if (value === null || value === '') {
    return undefined;
  }
  if (value === 'true' || value === '1') {
    return true;
  }
  if (value === 'false' || value === '0') {
    return false;
  }
  return undefined;
}
