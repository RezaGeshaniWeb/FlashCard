import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { AUTH_COOKIE_NAME, AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from '@/constants';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

function getCookieName(): string {
  return process.env.AUTH_STORAGE_KEY ?? AUTH_COOKIE_NAME;
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getCookieName())?.value;
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await hasValidSession(request);

  if (isProtectedPath(pathname) && !authenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && authenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/decks/:path*',
    '/study/:path*',
    '/statistics/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
