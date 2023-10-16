import 'isomorphic-fetch';
import { GET } from '@/app/api/me/route';
import { getUserByUsername } from '@/service/user';
import { NextResponse } from 'next/server';
import { fakeHomeUser } from '@/tests/mock/user/users';
import { withSessionUser } from '@/util/session';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/user', () => ({ getUserByUsername: jest.fn() }));
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/me', () => {
  afterEach(() => {
    (getUserByUsername as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });

  it('should return user data if the user is already logged in', async () => {
    (getUserByUsername as jest.Mock).mockImplementation(
      async () => fakeHomeUser
    );
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });

    await GET();

    expect(getUserByUsername).toHaveBeenCalledTimes(1);
    expect(getUserByUsername).toHaveBeenCalledWith(fakeHomeUser.username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeHomeUser);
  });
});
