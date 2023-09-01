import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsernameOrName } from '@/service/user';

type Context = {
  params: {
    usernameOrName: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  console.log('/api/users/[usernameOrName] called with context: ', context);
  return getUserByUsernameOrName(context.params.usernameOrName).then((data) =>
    NextResponse.json(data ? [data] : data)
  );
}
