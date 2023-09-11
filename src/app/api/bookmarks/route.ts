import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addBookmark, removeBookmark } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }
  const { id, bookmark } = await req.json();

  if (!id || bookmark === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const request = bookmark ? addBookmark : removeBookmark;

  return request(user.id, id) //
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
