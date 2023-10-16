import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { addBookmark, removeBookmark } from '@/service/user';
import { PUT } from '@/app/api/bookmarks/route';
import { withSessionUser } from '@/util/session';
import { fakeHomeUser } from '@/tests/mock/user/users';

jest.mock('@/util/session', () => ({ withSessionUser: jest.fn() }));
jest.mock('@/service/user', () => ({
  removeBookmark: jest.fn(),
  addBookmark: jest.fn(),
}));
jest.mock('next/server');

describe('/api/bookmarks', () => {
  const ERROR_MESSAGE = 'something went wrong';
  const BAD_REQUEST_MESSAGE = 'Bad request';
  const AUTHENTICATION_ERROR_MESSAGE = 'Authentication Error';
  const STATUS_CODE_400 = 400;
  const STATUS_CODE_401 = 401;
  const STATUS_CODE_500 = 500;
  const METHOD_TYPE_PUT = 'PUT';

  beforeEach(() => {
    //
    (withSessionUser as jest.Mock).mockImplementation(async (callback) => {
      await callback(fakeHomeUser);
    });
  });

  afterEach(() => {
    (removeBookmark as jest.Mock).mockReset();
    (removeBookmark as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });

  it('should return a response with bad request message and status code of 400 when a ID is not provided in the body', async () => {
    const json = jest.fn(async () => ({ id: undefined, bookmark: true }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_PUT,
    });
    req.json = json;
    await PUT(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should return a response with bad request message and status code of 400 when a bookmark flag is not provided in the body', async () => {
    const json = jest.fn(async () => ({ id: 'testId', bookmark: undefined }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_PUT,
    });
    req.json = json;
    await PUT(req);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(BAD_REQUEST_MESSAGE, {
      status: STATUS_CODE_400,
    });
  });

  it('should invoke the addBookmark function when a bookmark flag provided in the body is set to true ', async () => {
    (addBookmark as jest.Mock).mockImplementation(async () => undefined);
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, bookmark: true }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_PUT,
    });
    req.json = json;
    await PUT(req);

    expect(addBookmark).toHaveBeenCalledTimes(1);
    expect(addBookmark).toHaveBeenCalledWith(userId, id);
  });

  it('should invoke the removeBookmark function when a like flag provided in the body is set to false ', async () => {
    (removeBookmark as jest.Mock).mockImplementation(async () => undefined);
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, bookmark: false }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_PUT,
    });
    req.json = json;
    await PUT(req);

    expect(removeBookmark).toHaveBeenCalledTimes(1);
    expect(removeBookmark).toHaveBeenCalledWith(userId, id);
  });

  it('should invoke the NextResponse with an error message and status code of 500 when an error occurs during invoking the request method', async () => {
    (removeBookmark as jest.Mock).mockImplementation(async () => {
      throw new Error(ERROR_MESSAGE);
    });
    const id = 'testId';
    const userId = fakeHomeUser.id;
    const json = jest.fn(async () => ({ id, bookmark: false }));
    const req: NextRequest = httpMocks.createRequest({
      method: METHOD_TYPE_PUT,
    });
    req.json = json;
    await PUT(req);

    expect(removeBookmark).toHaveBeenCalledTimes(1);
    expect(removeBookmark).toHaveBeenCalledWith(userId, id);
    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect(NextResponse).toHaveBeenCalledWith(JSON.stringify(ERROR_MESSAGE), {
      status: STATUS_CODE_500,
    });
  });
});
