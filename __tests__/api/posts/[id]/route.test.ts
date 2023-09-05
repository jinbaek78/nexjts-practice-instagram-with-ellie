import 'isomorphic-fetch';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fakeSession } from '@/tests/mock/user/session';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeHomeUser } from '@/tests/mock/user/users';
import { getPost } from '@/service/posts';
import { GET } from '@/app/api/posts/[id]/route';
import { fakeFullPost } from '@/tests/mock/post/post';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/posts', () => ({ getPost: jest.fn() }));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/post/[id]', () => {
  const { req } = createMocks({ method: 'GET' });
  const context = { params: { id: 'testid' } };

  afterEach(() => {
    (getPost as jest.Mock).mockReset();
    (getServerSession as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });
  it('should not return user data when the session is not available', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);

    const result = await GET(req, context);

    expect(getPost).not.toBeCalled();
    expect(result.status).toBe(401);
  });

  it('should invoke getPost method and json method on nextResponse with correct argument when the session is available', async () => {
    (getPost as jest.Mock).mockImplementation(async () => fakeFullPost);
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);

    await GET(req, context);

    expect(getPost).toHaveBeenCalledTimes(1);
    expect(getPost).toHaveBeenCalledWith(context.params.id);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeFullPost);
  });
});
