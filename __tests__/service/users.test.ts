import { client } from '@/service/sanity';
import {
  addBookmark,
  getUserByUsername,
  getUserForProfile,
  removeBookmark,
  searchUsers,
} from '@/service/user';
import {
  fakeProfileUser,
  fakeProfileUsers,
  fakeSearchUsers,
} from '@/tests/mock/user/users';
import { fakeSession } from '@/tests/mock/user/session';

jest.mock('@/service/sanity', () => ({
  client: {
    fetch: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('Users Service', () => {
  const {
    user: { username },
  } = fakeSession;

  afterEach(() => {
    (client.patch as jest.Mock).mockReset();
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
        async () => fakeSearchUsers
      );
      await searchUsers(KEYWORD);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        MATCHING_QUERY
      );
    });

    it('should not use matching query when a keyword is not provided', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeSearchUsers
      );
      await searchUsers();

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).not.toContain(
        MATCHING_QUERY
      );
    });

    it('should convert correctly to zero when a null value is provided for a following or followers ', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeSearchUsers
      );
      const result = await searchUsers(KEYWORD);
      const convertedResult = fakeSearchUsers.map((user) => ({
        ...user,
        following: user.following ?? 0,
        followers: user.followers ?? 0,
      }));

      expect(result).toEqual(convertedResult);
    });
  });

  describe('getUserForProfile', () => {
    it('should invoke fetch method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeProfileUser
      );
      const fetchQuery = `*[_type == "user" && username == "${username}"]`;

      await getUserForProfile(username);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        fetchQuery
      );
    });

    it('should convert correctly to zero when a null value is provided for a following or followers ', async () => {
      const user = fakeProfileUsers[0];
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeProfileUsers[0]
      );
      const result = await getUserForProfile('');
      const convertedResult = {
        ...user,
        following: user.following ?? 0,
        followers: user.followers ?? 0,
      };

      expect(result).toEqual(convertedResult);
    });
  });

  describe('addBookmark', () => {
    const commit = jest.fn();

    afterEach(() => {
      commit.mockClear();
    });
    it('should correctly invoke client methods with the expected arguments', async () => {
      const append = jest.fn().mockImplementation(() => ({ commit }));
      const setIfMissing = jest.fn().mockImplementation(() => ({ append }));
      (client.patch as jest.Mock).mockImplementation(() => ({
        setIfMissing,
      }));
      const postId = 'testPost';
      const userId = 'testUser';
      const setIfMissingArguments = { bookmarks: [] };
      const appendArguments = [
        'bookmarks',
        [
          {
            _ref: postId,
            _type: 'reference',
          },
        ],
      ];
      const commitArguments = { autoGenerateArrayKeys: true };

      await addBookmark(userId, postId);

      expect(client.patch).toHaveBeenCalledTimes(1);
      expect(client.patch).toHaveBeenCalledWith(userId);
      expect(setIfMissing).toHaveBeenCalledTimes(1);
      expect(setIfMissing).toHaveBeenCalledWith(setIfMissingArguments);
      expect(append).toHaveBeenCalledTimes(1);
      expect(append).toHaveBeenCalledWith(
        appendArguments[0],
        appendArguments[1]
      );
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(commitArguments);
    });

    it('should correctly invoke client methods with the expected arguments', async () => {
      const unset = jest.fn().mockImplementation(() => ({ commit }));
      (client.patch as jest.Mock).mockImplementation(() => ({
        unset,
      }));
      const postId = 'testPost';
      const userId = 'testUser';
      const unsetArguments = [`bookmarks[_ref=="${postId}"]`];

      await removeBookmark(userId, postId);

      expect(client.patch).toHaveBeenCalledTimes(1);
      expect(client.patch).toHaveBeenCalledWith(userId);
      expect(unset).toHaveBeenCalledTimes(1);
      expect(unset).toHaveBeenCalledWith(unsetArguments);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith();
    });
  });
});
