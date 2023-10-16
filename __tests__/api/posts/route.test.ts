import 'isomorphic-fetch';
import { fakeSession } from '@/tests/mock/user/session';
import { NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { fakeHomeUser } from '@/tests/mock/user/users';
import { GET, POST } from '@/app/api/posts/route';
import { createPost, getFollowingPostsOf } from '@/service/posts';
import { withSessionUser } from '@/util/session';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('@/service/posts', () => ({
  getFollowingPostsOf: jest.fn(),
  createPost: jest.fn(),
}));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));
jest.mock('next/server');

describe('/api/posts', () => {
  beforeEach(() => {
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });
  });
  afterEach(() => {
    (getFollowingPostsOf as jest.Mock).mockReset();
    (createPost as jest.Mock).mockReset();
    (NextResponse.json as jest.Mock).mockReset();
  });

  describe('GET', () => {
    it('should return user data if the session is available', async () => {
      (getFollowingPostsOf as jest.Mock).mockImplementation(
        async () => fakeHomeUser
      );

      await GET();

      expect(getFollowingPostsOf).toHaveBeenCalledTimes(1);
      expect(getFollowingPostsOf).toHaveBeenCalledWith(fakeHomeUser.username);
      expect(NextResponse.json).toHaveBeenCalledTimes(1);
      expect(NextResponse.json).toHaveBeenCalledWith(fakeHomeUser);
    });
  });

  describe('POST', () => {
    const BAD_REQUEST_MESSAGE = 'Bad request';
    const STATUS_CODE_400 = 400;
    const { req } = createMocks({ method: 'POST' });

    beforeEach(() => {
      (NextResponse as unknown as jest.Mock).mockClear();
      (createPost as jest.Mock).mockImplementation(async () => fakeHomeUser);
    });
    it('should invoke NextResponse with a bad request message and the status code of 400 when a text is not provided in the body', async () => {
      const text = undefined;
      const file = 'testFile';
      const mockedGet = jest
        .fn()
        .mockReturnValueOnce(text)
        .mockReturnValueOnce(file);
      const formData = jest.fn(() => ({
        get: mockedGet,
      }));
      req.formData = formData;

      req.formData = await POST(req);

      expect(NextResponse).toHaveBeenCalledTimes(1);
      expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
        status: STATUS_CODE_400,
      });
    });

    it('should invoke NextResponse with a the bad request message and the status code of 400 when a file is not provided in the body', async () => {
      const text = 'testText';
      const file = undefined;
      const mockedGet = jest
        .fn()
        .mockReturnValueOnce(text)
        .mockReturnValueOnce(file);
      const formData = jest.fn(() => ({
        get: mockedGet,
      }));
      req.formData = formData;

      req.formData = await POST(req);

      expect(NextResponse).toHaveBeenCalledTimes(1);
      expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
        status: STATUS_CODE_400,
      });
    });

    it('should invoke the createPost with the correct userId, text and file when a user is logged in and text and file are provided in the body', async () => {
      const text = 'testText';
      const file = 'testFile';
      const mockedGet = jest
        .fn()
        .mockReturnValueOnce(text)
        .mockReturnValueOnce(file);
      const formData = jest.fn(() => ({
        get: mockedGet,
      }));
      req.formData = formData;

      req.formData = await POST(req);

      expect(createPost).toHaveBeenCalledTimes(1);
      expect(createPost).toHaveBeenCalledWith(fakeHomeUser.id, text, file);
      expect(NextResponse.json).toHaveBeenCalledTimes(1);
      expect(NextResponse.json).toHaveBeenCalledWith(fakeHomeUser);
    });
  });
});
