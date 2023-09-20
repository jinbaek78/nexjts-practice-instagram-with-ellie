import { act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import usePosts from '@/hooks/posts';
import { SWRConfig } from 'swr';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import httpMocks from 'node-mocks-http';
import { CacheKeysContext } from '@/context/CacheKeysContext';

global.fetch = jest.fn();

describe('usePosts hook', () => {
  const fetcher = jest.fn(async () => fakeSimplePosts);
  const res = httpMocks.createResponse();
  const username = 'testUserName';
  const query = 'testQuery';
  const postsKey = `/api/users/${username}/${query}`;

  const ProvidersWrapper = ({
    username,
    query,
  }: {
    username: string;
    query: string;
  }) => {
    return function Providers({ children }: { children: React.ReactNode }) {
      return (
        <CacheKeysContext.Provider
          value={{ postsKey: `/api/users/${username}/${query}` }}
        >
          <SWRConfig value={{ fetcher, provider: () => new Map() }}>
            {children}
          </SWRConfig>
        </CacheKeysContext.Provider>
      );
    };
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockImplementation(async () => res);
  });
  afterEach(() => {
    fetcher.mockClear();
    (fetch as jest.Mock).mockClear();
  });

  it('should invoke useSWR with the correct cacheKeys URL', async () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: ProvidersWrapper({
        username,
        query,
      }),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(postsKey);
  });

  it('should return posts, isLoading status, error flag, setLike and postComment function correctly', async () => {
    const functionTypeText = 'function';
    const { result } = renderHook(() => usePosts(), {
      wrapper: ProvidersWrapper({
        username,
        query,
      }),
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { posts, isLoading, error, setLike, postComment } = result.current;
    expect(posts).toEqual(fakeSimplePosts);
    expect(isLoading).toEqual(false);
    expect(error).toBe(undefined);
    expect(typeof setLike).toBe(functionTypeText);
    expect(typeof postComment).toBe(functionTypeText);
  });

  it("should update 'posts' with 'newPosts' containing a post that contains the username in 'liked' list  after invoking the setLike function", async () => {
    const postNotContainingUsernameInLiked = fakeSimplePosts[0];
    const username = 'testUsername';
    const { result } = renderHook(() => usePosts(), {
      wrapper: ProvidersWrapper({
        username,
        query,
      }),
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.posts?.[0]?.likes).not.toContain(username);
    const { setLike } = result.current;

    act(() => {
      setLike(postNotContainingUsernameInLiked, username, true);
    });

    expect(result.current.posts?.[0]?.likes).toContain(username);
  });

  it("should update 'posts' with 'newPosts' containing a post that no longer contains the username in the 'liked' list after invoking the setLike function", async () => {
    const postContainingUsernameInLiked = fakeSimplePosts[1];
    const username = 'testUsername';
    const { result } = renderHook(() => usePosts(), {
      wrapper: ProvidersWrapper({
        username,
        query,
      }),
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.posts?.[1]?.likes).toContain(username);
    const { setLike } = result.current;

    act(() => {
      setLike(postContainingUsernameInLiked, username, false);
    });

    expect(result.current.posts?.[1]?.likes).not.toContain(username);
  });

  it('should invoke a fetch with correct url and options after invoking the setLike function', async () => {
    const { id } = fakeSimplePosts[0];
    const LIKE_BOOLEAN = false;
    const username = 'testUsername';
    const fetchURL = '/api/likes';
    const fetchOption = {
      method: 'PUT',
      body: JSON.stringify({ id, like: LIKE_BOOLEAN }),
    };
    const { result } = renderHook(() => usePosts(), {
      wrapper: ProvidersWrapper({
        username,
        query,
      }),
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const { setLike } = result.current;

    act(() => {
      setLike(fakeSimplePosts[0], username, LIKE_BOOLEAN);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fetchURL, fetchOption);
  });
});
