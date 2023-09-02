import 'isomorphic-fetch';
import { searchUsers } from '@/service/user';
import { fakeProfileUsers } from '@/tests/mock/user/users';
import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/search/[keyword]/route';
import httpMocks from 'node-mocks-http';

jest.mock('@/service/user', () => ({ searchUsers: jest.fn() }));
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/search/[keyword]', () => {
  it('should invoke searchUsers method and json method on nextResponse with correct argument', async () => {
    const keyword = 'test';
    const context = { params: { keyword: keyword } };
    const req = httpMocks.createRequest({ method: 'GET' });
    (searchUsers as jest.Mock).mockImplementation(async () => fakeProfileUsers);

    await GET(req, context);

    expect(searchUsers).toHaveBeenCalledTimes(1);
    expect((searchUsers as jest.Mock).mock.calls[0][0]).toBe(
      context.params.keyword
    );
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeProfileUsers);
  });
});
