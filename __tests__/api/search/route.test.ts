import 'isomorphic-fetch';
import { GET } from '@/app/api/search/route';
import { searchUsers } from '@/service/user';
import { fakeSearchUsers } from '@/tests/mock/user/users';
import { NextResponse } from 'next/server';

jest.mock('@/service/user', () => ({ searchUsers: jest.fn() }));
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('/api/search', () => {
  it('should invoke searchUsers method and json method on nextResponse with correct argument', async () => {
    (searchUsers as jest.Mock).mockImplementation(async () => fakeSearchUsers);

    await GET();

    expect(searchUsers).toHaveBeenCalledTimes(1);
    expect((searchUsers as jest.Mock).mock.calls[0][0]).toBe(undefined);
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(fakeSearchUsers);
  });
});
