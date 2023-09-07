import 'isomorphic-fetch';
import { NextRequest, NextResponse } from 'next/server';
import httpMocks from 'node-mocks-http';
import { GET } from '@/app/api/users/[...slug]/route';
import { getLikedPostsOf, getPostsOf, getSavedPostsOf } from '@/service/posts';

jest.mock('@/service/posts', () => ({
  getPostsOf: jest.fn(),
  getLikedPostsOf: jest.fn(),
  getSavedPostsOf: jest.fn(),
}));

jest.mock('next/server');

// jest.mock('next/server', () => ({
//   ...jest.requireActual('next/server'),
//   NextResponse: jest.fn(() => ({
//     json: jest.fn(),
//   })),
// }));

// jest.mock('next/server', () => ({
//   ...jest.requireActual('next/server'),
//   NextResponse: {
//     json: jest.fn(),
//   },
// }));

describe('/api/users/[...slug]', () => {
  const BAD_REQUEST_MESSAGE = 'Bad Request';
  const STATUS_CODE_400 = 400;
  const req = httpMocks.createRequest({ method: 'GET' });
  const username = 'testUserName';

  afterEach(() => {
    (getPostsOf as jest.Mock).mockReset();
    (getLikedPostsOf as jest.Mock).mockReset();
    (getSavedPostsOf as jest.Mock).mockReset();
    (NextResponse as unknown as jest.Mock).mockReset();
    (NextResponse.json as unknown as jest.Mock).mockReset();
  });
  it('should invoke NextResponse with bad request message and status code of 400 code when a slug is not provided', async () => {
    const context: any = { params: { slug: undefined } };

    await GET(req, context);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][0]).toBe(
      BAD_REQUEST_MESSAGE
    );
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][1]).toEqual({
      status: STATUS_CODE_400,
    });
  });

  it('should invoke NextResponse with bad request message and status code of 400 code When a slug is not of array type', async () => {
    const context: any = { params: { slug: 'test' } };

    await GET(req, context);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][0]).toBe(
      BAD_REQUEST_MESSAGE
    );
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][1]).toEqual({
      status: STATUS_CODE_400,
    });
  });

  it('should invoke NextResponse with bad request message and status code of 400 code when a slug is an array type but its length is less than 2', async () => {
    const context: any = { params: { slug: [] } };

    await GET(req, context);

    expect(NextResponse).toHaveBeenCalledTimes(1);
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][0]).toBe(
      BAD_REQUEST_MESSAGE
    );
    expect((NextResponse as unknown as jest.Mock).mock.calls[0][1]).toEqual({
      status: STATUS_CODE_400,
    });
  });

  it("should trigger the invocation of getPostsOf with the username when a query matches to 'saved'", async () => {
    const requestResult = undefined;
    (getSavedPostsOf as jest.Mock).mockImplementation(
      async () => requestResult
    );
    const query = 'saved';
    const context: any = { params: { slug: [username, query] } };

    await GET(req, context);

    expect(NextResponse).not.toBeCalled();
    expect(getSavedPostsOf).toHaveBeenCalledTimes(1);
    expect(getSavedPostsOf).toHaveBeenCalledWith(username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(requestResult);
  });

  it("should trigger the invocation of getLikedPostsOf with the username when a query matches to 'liked'", async () => {
    const requestResult = undefined;
    (getLikedPostsOf as jest.Mock).mockImplementation(
      async () => requestResult
    );
    const query = 'liked';
    const context: any = { params: { slug: [username, query] } };

    await GET(req, context);

    expect(NextResponse).not.toBeCalled();
    expect(getLikedPostsOf).toHaveBeenCalledTimes(1);
    expect(getLikedPostsOf).toHaveBeenCalledWith(username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(requestResult);
  });

  it("should trigger the invocation of getPostOf with the username when a query does not match any 'saved' or 'liked'", async () => {
    const requestResult = undefined;
    (getPostsOf as jest.Mock).mockImplementation(async () => requestResult);
    const query = 'posts';
    const context: any = { params: { slug: [username, query] } };

    await GET(req, context);

    expect(NextResponse).not.toBeCalled();
    expect(getPostsOf).toHaveBeenCalledTimes(1);
    expect(getPostsOf).toHaveBeenCalledWith(username);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(requestResult);
  });
});
