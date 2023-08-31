import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getPostCommentsById } from '@/service/posts';
import { authOptions } from '../../auth/[...nextauth]/route';

type Props = {
  params: { postId: string };
};
export async function GET(req: Request, { params: { postId } }: Props) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  //

  return getPostCommentsById(postId).then((data) => NextResponse.json(data));
}
