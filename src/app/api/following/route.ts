import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getFollowingUsers } from '@/service/user';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const session = await getServerSession(authOptions);
  // const sessionCookie = cookieStore.get('next-auth.session-token');
  //📌❓ how to parse session in cookie ? what can I use some tools?

  console.log('api: session: ', session);
  const users = await getFollowingUsers(session?.user.email || '');
  console.log('api: users: ', users);

  return NextResponse.json(users);
}
