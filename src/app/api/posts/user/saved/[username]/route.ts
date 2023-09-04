import { getUserSavedPosts } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { username: string };
};
export async function GET(_: NextRequest, context: Context) {
  console.log('get Called with context:  ', context);
  return getUserSavedPosts(context.params.username).then((data) =>
    NextResponse.json(data)
  );
}
