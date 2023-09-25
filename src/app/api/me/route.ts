import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/service/user';

export async function GET(req: NextRequest) {
  const user = req.headers.get('user')
    ? JSON.parse(req.headers.get('user') || '')
    : null;

  return getUserByUsername(user.username).then((data) =>
    NextResponse.json(data)
  );
}
