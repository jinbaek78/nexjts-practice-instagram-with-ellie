import '@/tests/mock/module/usePosts';
import '@/tests/mock/module/PostListCard';
import usePosts from '@/tests/mock/module/usePosts';
import PostListCard from '@/tests/mock/module/PostListCard';

import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import GridSpinner from '@/components/ui/GridSpinner';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import PostList from '@/components/PostList';

jest.mock('@/components/ui/GridSpinner');

describe('PostList', () => {
  afterEach(() => {
    (PostListCard as jest.Mock).mockReset();
    (GridSpinner as jest.Mock).mockReset();
  });

  it('should render posts correctly when posts are available', async () => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: fakeSimplePosts,
      isLoading: true,
    }));
    render(<PostList />);

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
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: undefined,
      isLoading: true,
    }));
    render(<PostList />);

    expect(PostListCard).not.toBeCalled();
  });
});
