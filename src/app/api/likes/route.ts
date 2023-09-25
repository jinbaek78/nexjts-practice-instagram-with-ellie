import { dislikePost, likePost } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

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
