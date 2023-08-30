import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getFollowingPostsByUsername } from '@/service/user';

export async function GET(request: Request, response: Response) {
  console.log('posts GET called');
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  return getFollowingPostsByUsername(user.username).then((data) =>
    NextResponse.json(data)
  );
}
