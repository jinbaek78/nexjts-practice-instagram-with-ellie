import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { followUser, getUserByUsername, unFollowUser } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id, username, type } = await req.json();
  console.log(id, username, type);

  if (!id || username === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const targetUser = await getUserByUsername(username);
  console.log('targetUser: ', targetUser);
  const request = type === 'unfollow' ? unFollowUser : followUser;

  return request(id, targetUser.id) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
