import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addBookmark, follow, removeBookmark, unfollow } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id: targetId, follow: isFollow } = await req.json();
  console.log(targetId, isFollow);

  if (!targetId || isFollow === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const request = isFollow ? follow : unfollow;

  return request(user.id, targetId) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
