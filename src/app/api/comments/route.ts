import { addComment } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

  const { id, comment } = await req.json();

  if (!id || comment === undefined) {
    return new NextResponse('Bad request', { status: 400 });
  }

  return addComment(id, user.id, comment)
    .then((res) => NextResponse.json(res))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
