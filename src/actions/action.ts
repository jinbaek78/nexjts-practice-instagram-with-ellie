'use server';

import { revalidateTag } from 'next/cache';
export default async function revalidateProfileUser(username: string) {
  return revalidateTag(`profile/${username}`);
}
