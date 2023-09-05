import 'isomorphic-fetch';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fakeSession } from '@/tests/mock/user/session';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeHomeUser } from '@/tests/mock/user/users';
import { GET } from '@/app/api/posts/route';
import { getFollowingPostsOf } from '@/service/posts';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/posts', () => ({ getFollowingPostsOf: jest.fn() }));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/me', () => {
  afterEach(() => {
    (getFollowingPostsOf as jest.Mock).mockReset();
    (getServerSession as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });
  it('should not return user data if the session is not available', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);

    const result = await GET();

    expect(getFollowingPostsOf).not.toBeCalled();
    expect(result.status).toBe(401);
  });

  it('should return user data if the session is available', async () => {
    (getFollowingPostsOf as jest.Mock).mockImplementation(
      async () => fakeHomeUser
    );
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);

    await GET();

    expect(getFollowingPostsOf).toHaveBeenCalledTimes(1);
    expect(getFollowingPostsOf).toHaveBeenCalledWith(fakeSession.user.username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeHomeUser);
  });
});
