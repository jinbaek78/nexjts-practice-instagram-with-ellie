import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { publishPost } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new NextResponse('Authentication Error', { status: 401 });
  }

  const data = await req.formData();
  const imageFile = data.get('image') as File;
  const text = data.get('text') as string;

  if (!imageFile || !text) {
    return new NextResponse('Bad request', { status: 400 });
  }

  return publishPost(imageFile, text, user.id) //
    .then((data) => NextResponse.json(data))
    .catch(
      (error) =>
        new NextResponse(JSON.stringify(error.message), { status: 500 })
    );
}
