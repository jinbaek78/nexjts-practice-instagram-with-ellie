import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { addComment } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { fakeSession } from '@/tests/mock/user/session';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { POST } from '@/app/api/comments/route';
jest.mock('@/service/posts', () => ({
  addComment: jest.fn(),
}));
jest.mock('next/server');
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: jest.fn(),
}));

describe('/api/comments', () => {
  const ERROR_MESSAGE = 'something went wrong';
  const BAD_REQUEST_MESSAGE = 'Bad request';
  const AUTHENTICATION_ERROR_MESSAGE = 'Authentication Error';
  const STATUS_CODE_400 = 400;
  const STATUS_CODE_401 = 401;
  const STATUS_CODE_500 = 500;
  const METHOD_TYPE_POST = 'POST';
  const ID = 'testId';
  const COMMENT = 'testComent';
  beforeEach(() => {
    (getServerSession as jest.Mock).mockImplementation(async () => fakeSession);
  });

  afterEach(() => {
    (addComment as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });
  it('should return a NextResponse with authentication error message and status code of 401 when a user is not logged in and makes a request', async () => {
    (getServerSession as jest.Mock).mockImplementation(async () => undefined);
    const req = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
      body: { id: ID, comment: COMMENT },
    });

    await POST(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(AUTHENTICATION_ERROR_MESSAGE, {
      status: STATUS_CODE_401,
    });
  });
  it('should return a response with bad request message and status code of 400 when a ID is not provided in the body', async () => {
    const json = jest.fn(async () => ({
      id: undefined,
      comment: COMMENT,
    }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should return a response with bad request message and status code of 400 when a comment is empty in the body', async () => {
    const json = jest.fn(async () => ({
      id: ID,
      comment: undefined,
    }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should invoke the addComment function when a ID and  a comment in the body is not a empty ', async () => {
    (addComment as jest.Mock).mockImplementation(async () => undefined);
    const json = jest.fn(async () => ({ id: ID, comment: COMMENT }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith(ID, fakeSession.user.id, COMMENT);
  });

  it('should invoke the NextResponse with an error message and status code of 500 when an error occurs during invoking the addComment method', async () => {
    (addComment as jest.Mock).mockImplementation(async () => {
      throw new Error(ERROR_MESSAGE);
    });
    const json = jest.fn(async () => ({ id: ID, comment: COMMENT }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith(ID, fakeSession.user.id, COMMENT);
    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(JSON.stringify(ERROR_MESSAGE), {
      status: STATUS_CODE_500,
    });
  });
});
