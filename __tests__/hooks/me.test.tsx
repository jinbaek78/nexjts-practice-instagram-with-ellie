import { act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SWRConfig } from 'swr';
import httpMocks from 'node-mocks-http';
import { fakeHomeUsers } from '@/tests/mock/user/users';
import useMe from '@/hooks/me';

global.fetch = jest.fn();

describe('useMe hook', () => {
  const postId = 'testPost';
  const fetcher = jest.fn(async () => fakeHomeUsers[0]);
  const res = httpMocks.createResponse();

  beforeEach(() => {
    (fetch as jest.Mock).mockImplementation(async () => res);
    fetcher.mockImplementation(async () => fakeHomeUsers[0]);
  });
  afterEach(() => {
    fetcher.mockReset();
    (fetch as jest.Mock).mockClear();
  });

  // Test the return structure of the useMe hook
  it('should return user information, isLoading status, flag and setBookmark function and toggleFollow function correctly', async () => {
    const functionType = 'function';
    const { result } = renderHook(() => useMe(), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { user, isLoading, error, setBookmark, toggleFollow } =
      result.current;
    expect(user).toEqual(fakeHomeUsers[0]);
    expect(isLoading).toEqual(false);
    expect(error).toBe(undefined);
    expect(typeof setBookmark).toBe(functionType);
    expect(typeof toggleFollow).toBe(functionType);
  });

  // Test that a postId gets added to bookmarks
  it("should update 'user' with 'newUser' containing a bookmarks that contains the postId in 'bookmarks' list after invoking the setBookmark function", async () => {
    const userNotContainingPostIdInBookmarks = fakeHomeUsers[0];
    fetcher.mockImplementation(async () => userNotContainingPostIdInBookmarks);
    const { result } = renderHook(() => useMe(), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user?.bookmarks).not.toContain(postId);
    const { setBookmark } = result.current;

    act(() => {
      setBookmark(postId, true);
    });

    expect(result.current.user?.bookmarks).toContain(postId);
  });

  // Test that a postId gets removed from bookmarks
  it("should update 'user' with 'newUser' containing a bookmarks that no longer contains the postId in the 'bookmarks' list after invoking the setBookmark function", async () => {
    const userContainingPostIdInBookmarks = fakeHomeUsers[1];
    fetcher.mockImplementation(async () => userContainingPostIdInBookmarks);
    const { result } = renderHook(() => useMe(), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user?.bookmarks).toContain(postId);
    const { setBookmark } = result.current;

    act(() => {
      setBookmark(postId, false);
    });

    expect(result.current.user?.bookmarks).not.toContain(postId);
  });

  // Test that the fetch function gets called with the correct parameters
  it('should invoke a fetch with correct url and options after invoking the setBookmark function', async () => {
    const defaultBookmarkState = false;
    const fetchURL = '/api/bookmarks';
    const method = 'PUT';
    const fetchOption = {
      method,
      body: JSON.stringify({ id: postId, bookmark: defaultBookmarkState }),
    };
    const { result } = renderHook(() => useMe(), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const { setBookmark } = result.current;

    act(() => {
      setBookmark(postId, defaultBookmarkState);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fetchURL, fetchOption);
  });

  // Test that the fetch function gets called with the correct parameters
  it('should invoke a fetch with correct url and options after invoking the toggleFollow function', async () => {
    const fetchURL = '/api/follow';
    const method = 'PUT';
    const targetId = 'testTargetId';
    const isFollow = false;
    const fetchOption = {
      method,
      body: JSON.stringify({ id: targetId, follow: isFollow }),
    };
    const { result } = renderHook(() => useMe(), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const { toggleFollow } = result.current;

    act(() => {
      toggleFollow(targetId, isFollow);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fetchURL, fetchOption);
  });

  function SWRConfigProvider({ children }: { children: React.ReactNode }) {
    return (
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        {children}
      </SWRConfig>
    );
  }
});
