import { client } from '@/service/sanity';
import { getUserByUsername } from '@/service/user';
import { fakeDetailUser } from '@/tests/mock/detailUsers';
import { fakeSession } from '@/tests/mock/session';

jest.mock('@/service/sanity', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

describe('Users Service', () => {
  const {
    user: { username },
  } = fakeSession;
  afterEach(() => {
    (client.fetch as jest.Mock).mockReset();
  });

  it('should invoke fetch method with correct query', async () => {
    const fetchQuery = `
    *[_type == "user" && username == "${username}"][0]{
      ...,
      "id": _id,
      following[]->{username, image},
      followers[]->{username, image},
      "bookmarks":bookmarks[]->_id
    }
    `;
    await getUserByUsername(username);

    expect(client.fetch).toHaveBeenCalledTimes(1);
    expect(client.fetch).toHaveBeenCalledWith(fetchQuery);
  });
});
