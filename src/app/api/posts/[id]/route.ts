import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  getPost,
  addLikedUserToPost,
  removeUserFromLikes,
} from '@/service/posts';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PostData } from '@/components/PostList';
import { getUserByUsername } from '@/service/user';

type Context = {
  params: { id: string };
};

export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  return getPost(context.params.id).then((data) => NextResponse.json(data));
}

export async function POST(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }
  const postId = context?.params?.id;
  const data: PostData = await request.json();
  const { method, type, username } = data;
  const userDetail = await getUserByUsername(username);
  const userId = userDetail?._id;

  if (type === 'like') {
    if (method === 'add') {
      return addLikedUserToPost(postId, userId).then((data) =>
        NextResponse.json(data)
      );
    } else if (method === 'delete') {
      return removeUserFromLikes(postId, userId).then((data) =>
        NextResponse.json(data)
      );
    }
  }
}
