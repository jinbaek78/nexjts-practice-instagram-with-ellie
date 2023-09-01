import { client } from '@/service/sanity';
import { getUserByUsernameOrName } from '@/service/user';
import { fakeDetailUser } from '@/tests/mock/user/detailUsers';
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

  describe('getUserByUsernameOrName', () => {
    it('should invoke fetch method with correct query', async () => {
      const fetchQuery = `*[_type == "user" && username == "${username}"]`;

      await getUserByUsernameOrName(username);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        fetchQuery
      );
    });
  });
});
