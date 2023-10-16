import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { follow, unfollow } from '@/service/user';
import { PUT } from '@/app/api/follow/route';
import { withSessionUser } from '@/util/session';
import { fakeHomeUser } from '@/tests/mock/user/users';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('@/service/posts', () => ({
  dislikePost: jest.fn(),
  likePost: jest.fn(),
}));
jest.mock('next/server');
jest.mock('@/service/user', () => ({
  follow: jest.fn(),
  unfollow: jest.fn(),
}));

describe('/api/follow', () => {
  const ERROR_MESSAGE = 'something went wrong';
  const BAD_REQUEST_MESSAGE = 'Bad request';
  const AUTHENTICATION_ERROR_MESSAGE = 'Authentication Error';
  const STATUS_CODE_400 = 400;
  const STATUS_CODE_401 = 401;
  const STATUS_CODE_500 = 500;
  beforeEach(() => {
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });
  });

  afterEach(() => {
    (follow as jest.Mock).mockReset();
    (unfollow as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });

  it('should return a response with bad request message and status code of 400 when a ID is not provided in the body', async () => {
    const follow = false;
    const json = jest.fn(async () => ({ id: undefined, follow }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should return a response with bad request message and status code of 400 when a follow flag is not provided in the body', async () => {
    const json = jest.fn(async () => ({ id: 'testId', follow: undefined }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should invoke the follow function when a follow flag provided in the body is set to true ', async () => {
    (follow as jest.Mock).mockImplementation(async () => undefined);
    const id = fakeHomeUser.id;
    const isFollow = true;
    const targetId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, follow: isFollow }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(follow).toHaveBeenCalledTimes(1);
    expect(follow).toHaveBeenCalledWith(id, targetId);
  });

  it('should invoke the unfollow function when a follow flag provided in the body is set to false ', async () => {
    (unfollow as jest.Mock).mockImplementation(async () => undefined);
    const id = fakeHomeUser.id;
    const isFollow = false;
    const targetId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, follow: isFollow }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(unfollow).toHaveBeenCalledTimes(1);
    expect(unfollow).toHaveBeenCalledWith(id, targetId);
  });

  it('should invoke the NextResponse with an error message and status code of 500 when an error occurs during invoking the request method', async () => {
    (unfollow as jest.Mock).mockImplementation(async () => {
      throw new Error(ERROR_MESSAGE);
    });
    const id = fakeHomeUser.id;
    const isFollow = false;
    const targetId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, follow: isFollow }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(unfollow).toHaveBeenCalledTimes(1);
    expect(unfollow).toHaveBeenCalledWith(id, targetId);
    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(JSON.stringify(ERROR_MESSAGE), {
      status: STATUS_CODE_500,
    });
  });
});
