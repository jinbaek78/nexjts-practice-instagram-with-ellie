import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { fakeSession } from '@/tests/mock/user/session';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { follow, unfollow } from '@/service/user';
import { PUT } from '@/app/api/follow/route';

jest.mock('@/service/posts', () => ({
  dislikePost: jest.fn(),
  likePost: jest.fn(),
}));
jest.mock('next/server');
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));
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
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);
  });

  afterEach(() => {
    (follow as jest.Mock).mockReset();
    (unfollow as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });
  it('should return a NextResponse with authentication error message and status code of 401 when a user is not logged in and makes a request', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);
    const req = httpMocks.createRequest({
      method: 'PUT',
    });
    await PUT(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(AUTHENTICATION_ERROR_MESSAGE, {
      status: STATUS_CODE_401,
    });
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
    const id = fakeSession.user.id;
    const isFollow = true;
    const targetId = fakeSession.user.id;
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
    const id = fakeSession.user.id;
    const isFollow = false;
    const targetId = fakeSession.user.id;
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
    const id = fakeSession.user.id;
    const isFollow = false;
    const targetId = fakeSession.user.id;
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
