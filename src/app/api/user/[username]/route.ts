import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getUserForProfile } from '@/service/user';
import { authOptions } from '../../auth/[...nextauth]/route';

type Context = {
  params: { username: string };
};

export async function GET(request: NextRequest, context: Context) {
  const username = context.params.username;
  if (!username) {
    return new NextResponse('Bad request', { status: 400 });
  }

  return getUserForProfile(username).then((data) => NextResponse.json(data));
}
