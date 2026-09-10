import { NextResponse } from 'next/server';

export function middleware(req) {
  const session = req.cookies.get('dealloop_session')?.value;
  const secret = process.env.AUTH_SECRET || 'dealloop-dev-secret-change-me';

  if (session !== secret) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
