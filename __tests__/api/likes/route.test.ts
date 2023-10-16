import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { dislikePost, likePost } from '@/service/posts';
import { PUT } from '@/app/api/likes/route';
import { withSessionUser } from '@/util/session';
import { fakeHomeUser } from '@/tests/mock/user/users';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('@/service/posts', () => ({
  dislikePost: jest.fn(),
  likePost: jest.fn(),
}));
jest.mock('next/server');

describe('/api/likes', () => {
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
    (dislikePost as jest.Mock).mockReset();
    (likePost as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });

  it('should return a response with bad request message and status code of 400 when a ID is not provided in the body', async () => {
    const json = jest.fn(async () => ({ id: undefined, like: 'like!' }));
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

  it('should return a response with bad request message and status code of 400 when a like flag is not provided in the body', async () => {
    const json = jest.fn(async () => ({ id: 'testId', like: undefined }));
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

  it('should invoke the likePost function when a like flag provided in the body is set to true ', async () => {
    (likePost as jest.Mock).mockImplementation(async () => undefined);
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, like: true }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(likePost).toHaveBeenCalledTimes(1);
    expect(likePost).toHaveBeenCalledWith(id, userId);
  });

  it('should invoke the dislikePost function when a like flag provided in the body is set to false ', async () => {
    (dislikePost as jest.Mock).mockImplementation(async () => undefined);
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, like: false }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(dislikePost).toHaveBeenCalledTimes(1);
    expect(dislikePost).toHaveBeenCalledWith(id, userId);
  });

  it('should invoke the NextResponse with an error message and status code of 500 when an error occurs during invoking the request method', async () => {
    (dislikePost as jest.Mock).mockImplementation(async () => {
      throw new Error(ERROR_MESSAGE);
    });
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, like: false }));
    const req: NextRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    req.json = json;
    await PUT(req);

    expect(dislikePost).toHaveBeenCalledTimes(1);
    expect(dislikePost).toHaveBeenCalledWith(id, userId);
    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(JSON.stringify(ERROR_MESSAGE), {
      status: STATUS_CODE_500,
    });
  });
});
