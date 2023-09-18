import { act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as SWR from 'swr';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import { fakeFullPost } from '@/tests/mock/post/post';
import httpMocks from 'node-mocks-http';
import useFullPost from '@/hooks/post';
import { Comment } from '@/model/post';

global.fetch = jest.fn();

jest.mock('swr', () => {
  return {
    __esModule: true,
    ...jest.requireActual('swr'),
  };
});

jest.spyOn(SWR, 'useSWRConfig');

describe('useFullPost hook', () => {
  const fetcher = jest.fn(async () => fakeFullPost);
  const res = httpMocks.createResponse();
  const newComment: Comment = {
    comment: 'testComment',
    username: 'testUser',
    image: '/testImage',
  };
  const globalMutate = jest.fn();

  beforeEach(() => {
    (fetch as jest.Mock).mockImplementation(async () => res);
    (useSWRConfig as jest.Mock).mockImplementation(() => ({
      mutate: globalMutate,
    }));
  });
  afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
    fetcher.mockClear();
    globalMutate.mockClear();
    (fetch as jest.Mock).mockClear();
    (useSWRConfig as jest.Mock).mockClear();
  });

  it('should return posts, isLoading status, error flag and postComment function correctly', async () => {
    const function_type_text = 'function';
    const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
      return (
        <SWRConfig value={{ fetcher, provider: () => new Map() }}>
          {children}
        </SWRConfig>
      );
    };
    const { result } = renderHook(() => useFullPost(fakeFullPost.id), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { post, isLoading, error, postComment } = result.current;
    expect(post).toEqual(fakeFullPost);
    expect(isLoading).toEqual(false);
    expect(error).toBe(undefined);
    expect(typeof postComment).toBe(function_type_text);
  });

  it("should update 'post' with 'newPost' containing a comments that contains a new comment  after invoking the postComment function", async () => {
    const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
      return (
        <SWRConfig value={{ fetcher, provider: () => new Map() }}>
          {children}
        </SWRConfig>
      );
    };
    const { result } = renderHook(() => useFullPost(fakeFullPost.id), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.post?.comments).not.toContain(newComment);
    const { postComment } = result.current;

    act(() => {
      postComment(newComment);
    });

    expect(result.current.post?.comments).toContain(newComment);
  });

  it('should invoke a fetch with correct url and options after invoking the postComment function', async () => {
    const { id } = fakeFullPost;
    const fetchURL = '/api/comments';
    const method = 'POST';
    const fetchOption = {
      method,
      body: JSON.stringify({ id, comment: newComment.comment }),
    };
    const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
      return (
        <SWRConfig value={{ fetcher, provider: () => new Map() }}>
          {children}
        </SWRConfig>
      );
    };
    const { result } = renderHook(() => useFullPost(fakeFullPost.id), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const { postComment } = result.current;

    act(() => {
      postComment(newComment);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fetchURL, fetchOption);
  });

  it('should invoke globalMutate with correct url after a successful mutate operation', async () => {
    const expectedUrl = '/api/posts';
    const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
      return (
        <SWRConfig value={{ fetcher, provider: () => new Map() }}>
          {children}
        </SWRConfig>
      );
    };
    const { result } = renderHook(() => useFullPost(fakeFullPost.id), {
      wrapper: SWRConfigProvider,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const { postComment } = result.current;

    act(() => {
      postComment(newComment);
    });

    await waitFor(() => {
      expect(globalMutate).toHaveBeenCalledTimes(1);
    });

    expect(globalMutate).toHaveBeenCalledWith(expectedUrl);
  });
});
