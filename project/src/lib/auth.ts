import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/constants';
import type { JwtPayload, PublicUser } from '@/types';

const TOKEN_TTL = '7d';
const TOKEN_TTL_REMEMBER = '30d';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COOKIE_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

function getCookieName(): string {
  return process.env.AUTH_STORAGE_KEY ?? AUTH_COOKIE_NAME;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthCookieOptions {
  rememberMe?: boolean;
}

export async function signToken(
  user: Pick<PublicUser, 'id' | 'email' | 'name'>,
  options?: AuthCookieOptions,
): Promise<string> {
  const ttl = options?.rememberMe ? TOKEN_TTL_REMEMBER : TOKEN_TTL;

  return new SignJWT({
    email: user.email,
    name: user.name,
  } satisfies Omit<JwtPayload, 'sub'>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payloadToSession(payload);
  } catch {
    return null;
  }
}

function payloadToSession(payload: JWTPayload): SessionUser | null {
  const id = typeof payload.sub === 'string' ? payload.sub : null;
  const email = typeof payload.email === 'string' ? payload.email : null;
  const name = typeof payload.name === 'string' ? payload.name : null;

  if (!id || !email || !name) {
    return null;
  }

  return { id, email, name };
}

export async function setAuthCookie(
  token: string,
  options?: AuthCookieOptions,
): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = options?.rememberMe
    ? COOKIE_MAX_AGE_REMEMBER
    : COOKIE_MAX_AGE;

  cookieStore.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getCookieName());
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(getCookieName())?.value;
}

/** Server-side session from the auth cookie. */
export async function getSession(): Promise<SessionUser | null> {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
