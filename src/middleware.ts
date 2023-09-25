import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const apis = ['search', 'auth', 'users'].map((path) => `/api/${path}`);
const pages = ['search', 'user', 'auth'].map((path) => `/${path}`);
const next = ['_next'].map((path) => `/${path}`);
const notProtectedPaths = [...apis, ...pages, ...next];
const toBeReDirectedPathsIfNotLoggedIn = ['', 'new'].map((path) => `/${path}`);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = notProtectedPaths.every(
    (path) => !pathname.startsWith(path)
  );

  console.log(`${pathname} | ${isProtected ? '✅' : '❌'}`);
  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      if (
        toBeReDirectedPathsIfNotLoggedIn.some((p) => pathname.startsWith(p))
      ) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      return new Response('Authentication Error', { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      'user',
      JSON.stringify({
        ...token,
        username: token.email?.split('@')?.[0],
      })
    );
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }
  return NextResponse.next();
}

// 🐛For some reasons,  modifying header in middleware with matcher config is not works well
// export const config = {
//   matcher: ['/new', '/posts', '/'],
// };

// export default withAuth(
//   async function middleware(request: NextRequest) {
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('user', JSON.stringify(request.nextauth.token));

//     const response = NextResponse.next({
//       request: {
//         // New request headers
//         headers: requestHeaders,
//       },
//     });

//     return response;
//   },
//   {
//     callbacks: {
//       authorized({ token }) {
//         console.log('authorized called with token: ', token);
//         return !!token;
//       },
//     },
//   }
// );
