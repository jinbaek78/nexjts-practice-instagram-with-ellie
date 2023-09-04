import { getUserLikedPosts } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { userId: string };
};
export async function GET(_: NextRequest, context: Context) {
  console.log(
    '/api/posts/user/liked/[userId ]get Called with context:  ',
    context
  );
  return getUserLikedPosts(context.params.userId).then((data) =>
    NextResponse.json(data)
  );
}
