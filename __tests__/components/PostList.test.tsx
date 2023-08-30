import '@/tests/mock/module/PostListCard';
import PostListCard from '@/tests/mock/module/PostListCard';

import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { SWRConfig } from 'swr';
// import PostListCard from '@/components/PostListCard';
import GridSpinner from '@/components/ui/GridSpinner';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import PostList from '@/components/PostList';

// jest.mock('@/components/PostListCard');
jest.mock('@/components/ui/GridSpinner');

describe('PostList', () => {
  afterEach(() => {
    (PostListCard as jest.Mock).mockReset();
    (GridSpinner as jest.Mock).mockReset();
  });

  it('should render with loading spinner initially', async () => {
    const fetcher = jest.fn(async (url) => fakeSimplePosts);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostList />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(GridSpinner).toHaveBeenCalled();
    });

    expect(GridSpinner).toHaveBeenCalledTimes(1);
  });

  it('should render posts correctly when posts are available', async () => {
    const fetcher = jest.fn(async (url) => fakeSimplePosts);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostList />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(GridSpinner).toHaveBeenCalled();
    });

    expect(PostListCard).toHaveBeenCalledTimes(fakeSimplePosts.length);
    expect((PostListCard as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePosts[0]
    );
    expect((PostListCard as jest.Mock).mock.calls[0][0].priority).toBe(true);
    expect((PostListCard as jest.Mock).mock.calls[1][0].post).toEqual(
      fakeSimplePosts[1]
    );
    expect((PostListCard as jest.Mock).mock.calls[1][0].priority).toBe(true);
    expect((PostListCard as jest.Mock).mock.calls[2][0].post).toEqual(
      fakeSimplePosts[2]
    );
    expect((PostListCard as jest.Mock).mock.calls[2][0].priority).toBe(false);
  });

  it('should not render posts when posts are not available', async () => {
    const fetcher = jest.fn(async (url) => undefined);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostList />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(GridSpinner).toHaveBeenCalled();
    });

    expect(PostListCard).not.toBeCalled();
  });
});
