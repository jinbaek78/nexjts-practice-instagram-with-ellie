import { addBookmark, removeBookmark } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

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
