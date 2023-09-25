import { NextRequest, NextResponse } from 'next/server';
import { createPost, getFollowingPostsOf } from '@/service/posts';

export async function GET(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

  return getFollowingPostsOf(user.username).then((data) =>
    NextResponse.json(data)
  );
}

export async function POST(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

  const form = await req.formData();
  const text = form.get('text')?.toString();
  const file = form.get('file') as Blob;

  if (!text || !file) {
    return new NextResponse('Bad request', { status: 400 });
  }

  return createPost(user.id, text, file).then((data) =>
    NextResponse.json(data)
  );
}
