import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/service/posts';
import { authOptions } from '../../auth/[...nextauth]/route';

type Context = {
  params: { id: string };
};

export async function GET(req: NextRequest, context: Context) {
  return getPost(context.params.id).then((data) => NextResponse.json(data));
}
