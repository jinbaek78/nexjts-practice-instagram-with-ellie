import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fakeSession } from '@/tests/mock/user/session';
import { fakeAuthUser } from '@/tests/mock/user/users';
import { withSessionUser } from '@/util/session';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
// import { Response } from '/Users/jinbaek/Desktop/jin/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/lib.dom.d.ts';

global.fetch = jest.fn();
jest.mock('next/server', () => ({ NextResponse: jest.fn() }));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));

describe('withSessionUser', () => {
  const STATUS_CODE_401 = 401;
  const AUTHENTICATION_ERROR_MESSAGE = 'Authentication Error';
  const handler = jest.fn(async (fakeAuthUser) => new NextResponse());

  beforeEach(() => {
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);
  });

  afterEach(() => {
    (NextResponse as unknown as jest.Mock).mockReset();
    handler.mockClear();
  });

  it.only('should return a NextResponse with authentication error message and status code of 401 when a user is not logged in', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => null);

    await withSessionUser(handler);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(AUTHENTICATION_ERROR_MESSAGE, {
      status: STATUS_CODE_401,
    });
  });

  it('should invoke a handler with user when a user is logged in', async () => {
    await withSessionUser(handler);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(fakeSession.user);
  });
});
