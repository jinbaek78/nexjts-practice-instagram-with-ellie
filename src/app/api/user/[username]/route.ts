import { getUserDetailByUsername } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

type Context = {
  params: { username: string };
};

export async function GET(_: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  console.log('get Called with context:  ', context);

  return getUserDetailByUsername(context.params.username, user?.username).then(
    (data) => NextResponse.json(data)
  );
}
