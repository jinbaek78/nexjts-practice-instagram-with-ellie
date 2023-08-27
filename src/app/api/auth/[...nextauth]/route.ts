import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Session } from 'next-auth';

export type sessionWithRedirectTo = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    redirectTo?: string | null;
  };
  expires: string;
};
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session }: { session: sessionWithRedirectTo }) {
      if (session?.user) {
        session.user.redirectTo = `/user/${
          session?.user?.email?.split('@')[0]
        }`;
      }
      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('url: ', url);
      console.log('baseUrl: ', baseUrl);
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        const splitedPathes = url?.split('2F');
        console.log('splitedPathes: ', splitedPathes);
        if (splitedPathes.length > 1) {
          //
          console.log(
            `more than 1, so will be redirected to:  ${baseUrl}/${
              splitedPathes[splitedPathes.length - 1]
            }`
          );
          return `${baseUrl}/${splitedPathes[splitedPathes.length - 1]}`;
        }
        return url;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
