import { client } from '@/service/sanity';
import {
  addBookmark,
  follow,
  getUserByUsername,
  getUserForProfile,
  removeBookmark,
  searchUsers,
  unfollow,
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
    transaction: jest.fn(),
  },
}));

describe('Users Service', () => {
  const {
    user: { username },
  } = fakeSession;

  afterEach(() => {
    (client.patch as jest.Mock).mockReset();
    (client.fetch as jest.Mock).mockReset();
    (client.transaction as jest.Mock).mockReset();
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
      const nextTagOptions = {
        next: { tags: [`profile/${username}`] },
      };

      await getUserForProfile(username);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        fetchQuery
      );
      expect((client.fetch as jest.Mock).mock.calls[0][1]).toBe(undefined);
      expect((client.fetch as jest.Mock).mock.calls[0][2]).toEqual(
        nextTagOptions
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
  });

  describe('removeBookmark', () => {
    const commit = jest.fn();

    afterEach(() => {
      commit.mockClear();
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

  describe('follow', () => {
    const commit = jest.fn();

    afterEach(() => {
      commit.mockClear();
    });

    it('should correctly invoke client methods with the expected arguments', async () => {
      const append = jest.fn();
      const setIfMissing = jest.fn(() => ({ append }));
      const testUser = { setIfMissing };
      (client.transaction as jest.Mock).mockReturnThis();
      (client.patch as jest.Mock).mockImplementationOnce(
        (myId: string, callback: (user: typeof testUser) => void) => {
          callback(testUser);
          return {
            patch: client.patch,
          };
        }
      );
      (client.patch as jest.Mock).mockImplementationOnce(
        (myId: string, callback: (user: typeof testUser) => void) => {
          callback(testUser);
          return { commit };
        }
      );
      (client.patch as jest.Mock).mockImplementationOnce(() => ({ commit }));
      const myId = 'testMyId';
      const targetId = 'testTargetId';
      const commitOptions = { autoGenerateArrayKeys: true };
      const setIfMissingFirstArguments = { following: [] };
      const setIfMissingSecondArguments = { followers: [] };
      const appendFirstArguments = [
        'following',
        [{ _ref: targetId, _type: 'reference' }],
      ];
      const appendSecondArguments = [
        'followers',
        [{ _ref: myId, _type: 'reference' }],
      ];

      await follow(myId, targetId);

      expect(client.transaction).toHaveBeenCalledTimes(1);
      expect(client.transaction).toHaveBeenCalledWith();
      expect(client.patch).toHaveBeenCalledTimes(2);
      expect((client.patch as jest.Mock).mock.calls[0][0]).toBe(myId);
      expect(setIfMissing).toHaveBeenCalledTimes(2);
      expect((setIfMissing as jest.Mock).mock.calls[0][0]).toEqual(
        setIfMissingFirstArguments
      );
      expect((setIfMissing as jest.Mock).mock.calls[1][0]).toEqual(
        setIfMissingSecondArguments
      );
      expect(append).toHaveBeenCalledTimes(2);
      expect(append.mock.calls[0][0]).toEqual(appendFirstArguments[0]);
      expect(append.mock.calls[0][1]).toEqual(appendFirstArguments[1]);
      expect(append.mock.calls[1][0]).toEqual(appendSecondArguments[0]);
      expect(append.mock.calls[1][1]).toEqual(appendSecondArguments[1]);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(commitOptions);
    });
  });

  describe('unfollow', () => {
    const commit = jest.fn();

    afterEach(() => {
      commit.mockClear();
    });

    it('should correctly invoke client methods with the expected arguments', async () => {
      const unset = jest.fn();
      const testUser = { unset };
      (client.transaction as jest.Mock).mockReturnThis();
      (client.patch as jest.Mock).mockImplementationOnce(
        (myId: string, callback: (user: typeof testUser) => void) => {
          callback(testUser);
          return {
            patch: client.patch,
          };
        }
      );
      (client.patch as jest.Mock).mockImplementationOnce(
        (myId: string, callback: (user: typeof testUser) => void) => {
          callback(testUser);
          return { commit };
        }
      );
      (client.patch as jest.Mock).mockImplementationOnce(() => ({ commit }));
      const myId = 'testMyId';
      const targetId = 'testTargetId';
      const commitOptions = { autoGenerateArrayKeys: true };
      const unsetFirstArguments = [`following[_ref=="${targetId}"]`];
      const unsetSecondArguments = [`followers[_ref=="${myId}"]`];

      await unfollow(myId, targetId);

      expect(client.transaction).toHaveBeenCalledTimes(1);
      expect(client.transaction).toHaveBeenCalledWith();
      expect(client.patch).toHaveBeenCalledTimes(2);
      expect((client.patch as jest.Mock).mock.calls[0][0]).toBe(myId);
      expect(unset).toHaveBeenCalledTimes(2);
      expect(unset.mock.calls[0][0]).toEqual(unsetFirstArguments);
      expect(unset.mock.calls[1][0]).toEqual(unsetSecondArguments);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(commitOptions);
    });
  });
});
