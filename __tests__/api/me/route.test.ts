import 'isomorphic-fetch';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GET } from '@/app/api/me/route';
import { getUserByUsername } from '@/service/user';
import { fakeSession } from '@/tests/mock/user/session';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeHomeUser } from '@/tests/mock/user/users';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/user', () => ({ getUserByUsername: jest.fn() }));
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
    (getUserByUsername as jest.Mock).mockReset();
    (getServerSession as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });
  it('should not return user data if the session is not available', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);

    const result = await GET();

    expect(getUserByUsername).not.toBeCalled();
    expect(result.status).toBe(401);
  });

  it('should return user data if the session is available', async () => {
    (getUserByUsername as jest.Mock).mockImplementation(
      async () => fakeHomeUser
    );
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);

    await GET();

    expect(getUserByUsername).toHaveBeenCalledTimes(1);
    expect(getUserByUsername).toHaveBeenCalledWith(fakeSession.user.username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeHomeUser);
  });
});
