import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { SESSION_COOKIE, SESSION_PASSWORD } from '@/lib/session';

const PROTECTED = ['/subir', '/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!PROTECTED.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await unsealData<{ isAdmin?: boolean }>(cookie, {
      password: SESSION_PASSWORD,
    });
    if (!session?.isAdmin) throw new Error('Unauthorized');
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/subir', '/subir/:path*', '/admin', '/admin/:path*'],
};
