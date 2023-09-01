import { NextResponse } from 'next/server';
import { getAllUsers } from '@/service/user';

export async function GET() {
  console.log('/api/users called');
  return getAllUsers().then((data) => NextResponse.json(data));
}
