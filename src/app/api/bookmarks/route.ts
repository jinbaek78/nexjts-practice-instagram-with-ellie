import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { unBookmarkPost, bookmarkPost } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id, bookmark } = await req.json();
  console.log('PUT Called with : id, bookmark: ', id, bookmark);

  if (!id || bookmark === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const request = bookmark ? bookmarkPost : unBookmarkPost;

  return request(id, user.id) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
