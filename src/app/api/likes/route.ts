import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dislikePost, likePost } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id, like } = await req.json();

  if (!id || like === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const request = like ? likePost : dislikePost;

  return request(id, user.id) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
