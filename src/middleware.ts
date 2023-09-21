import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.get('next-auth.session-token') !== undefined;
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/new',
};
