import { follow, unfollow } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

  const { id: targetId, follow: isFollow } = await req.json();

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
