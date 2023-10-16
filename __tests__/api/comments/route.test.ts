import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { addComment } from '@/service/posts';
import { POST } from '@/app/api/comments/route';
import { withSessionUser } from '@/util/session';
import { fakeHomeUser } from '@/tests/mock/user/users';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('@/service/posts', () => ({
  addComment: jest.fn(),
}));
jest.mock('next/server');
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

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
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });
  });

  afterEach(() => {
    (addComment as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
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

  it('should invoke the addComment function when a ID and a comment in the body is not a empty ', async () => {
    (addComment as jest.Mock).mockImplementation(async () => undefined);
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id: ID, comment: COMMENT }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith(ID, userId, COMMENT);
  });

  it('should invoke the NextResponse with an error message and status code of 500 when an error occurs during invoking the addComment method', async () => {
    (addComment as jest.Mock).mockImplementation(async () => {
      throw new Error(ERROR_MESSAGE);
    });
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id: ID, comment: COMMENT }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_POST,
    });
    req.json = json;

    await POST(req);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith(ID, userId, COMMENT);
    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(JSON.stringify(ERROR_MESSAGE), {
      status: STATUS_CODE_500,
    });
  });
});
