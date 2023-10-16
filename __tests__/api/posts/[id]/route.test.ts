import 'isomorphic-fetch';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeHomeUser } from '@/tests/mock/user/users';
import { getPost } from '@/service/posts';
import { GET } from '@/app/api/posts/[id]/route';
import { fakeFullPost } from '@/tests/mock/post/post';
import { withSessionUser } from '@/util/session';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/service/posts', () => ({ getPost: jest.fn() }));

jest.mock('next/server');

describe('/api/post/[id]', () => {
  const { req } = createMocks({ method: 'GET' });
  const context = { params: { id: 'testid' } };
  beforeEach(() => {
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });
  });

  afterEach(() => {
    (getPost as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });

  it('should invoke getPost method and json method on nextResponse with correct argument when the session is available', async () => {
    (getPost as jest.Mock).mockImplementation(async () => fakeFullPost);

    await GET(req, context);

    expect(getPost).toHaveBeenCalledTimes(1);
    expect(getPost).toHaveBeenCalledWith(context.params.id);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeFullPost);
  });
});
