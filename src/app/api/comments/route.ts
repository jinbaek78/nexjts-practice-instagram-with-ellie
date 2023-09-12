import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addComment } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id: postId, userId, comment } = await req.json();

  if (!postId || !userId || !comment) {
    console.log('pistId, userId, comment: ', postId, userId, comment);
    return new NextResponse('Bad request', { status: 400 });
  }
  console.log(postId, userId, comment);

  return addComment(postId, userId, comment) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
