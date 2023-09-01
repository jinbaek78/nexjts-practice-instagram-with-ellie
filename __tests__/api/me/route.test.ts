import 'isomorphic-fetch';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GET } from '@/app/api/me/route';
import { getUserByUsernameOrName } from '@/service/user';
import { fakeSession } from '@/tests/mock/user/session';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeDetailUser } from '@/tests/mock/user/detailUsers';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/user', () => ({ getUserByUsernameOrName: jest.fn() }));
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
    (getUserByUsernameOrName as jest.Mock).mockReset();
    (getServerSession as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });
  it('should not return user data if the session is not available', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);

    const result = await GET();

    expect(getUserByUsernameOrName).not.toBeCalled();
    expect(result.status).toBe(401);
  });

  it('should return user data if the session is available', async () => {
    (getUserByUsernameOrName as jest.Mock).mockImplementation(
      async () => fakeDetailUser
    );
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);

    await GET();

    expect(getUserByUsernameOrName).toHaveBeenCalledTimes(1);
    expect(getUserByUsernameOrName).toHaveBeenCalledWith(
      fakeSession.user.username
    );
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeDetailUser);
  });
});
