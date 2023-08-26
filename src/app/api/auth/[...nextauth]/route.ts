import NextAuth from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  // callbacks: {
  //   async session({ session, user, token }) {
  //     console.log('session: ', session);
  //     console.log('user: ', user);
  //     console.log('token: ', token);
  //     return { session, token };
  //   },
  // },
};

// export async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // console.log('req: ', req);
//   console.log('res: ', res);
//   return await NextAuth(req, res, authOptions);
// }
// export { auth as GET, auth as POST };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
