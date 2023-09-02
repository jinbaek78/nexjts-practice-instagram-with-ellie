import { client } from '@/service/sanity';
import { getUserByUsername, searchUsers } from '@/service/user';
import { fakeProfileUsers } from '@/tests/mock/user/users';
import { fakeSession } from '@/tests/mock/user/session';

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

  describe('getUserByUsername', () => {
    it('should invoke fetch method with correct query', async () => {
      const fetchQuery = `*[_type == "user" && username == "${username}"]`;

      await getUserByUsername(username);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        fetchQuery
      );
    });
  });

  describe('searchUsers', () => {
    const KEYWORD = 'test';
    const MATCHING_QUERY = `&& (name match "${KEYWORD}" || username match "${KEYWORD}")`;
    it('should use matching query when a keyword is provided', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeProfileUsers
      );
      await searchUsers(KEYWORD);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        MATCHING_QUERY
      );
    });

    it('should not use matching query when a keyword is not provided', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeProfileUsers
      );
      await searchUsers();

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).not.toContain(
        MATCHING_QUERY
      );
    });

    it('should convert correctly to zero when a null value is provided for a following or followers ', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeProfileUsers
      );
      const result = await searchUsers(KEYWORD);
      const convertedResult = fakeProfileUsers.map((user) => ({
        ...user,
        following: user.following ?? 0,
        followers: user.followers ?? 0,
      }));

      expect(result).toEqual(convertedResult);
    });
  });
});
