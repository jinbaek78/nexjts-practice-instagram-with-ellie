import '@/tests/mock/module/usePosts';
import '@/tests/mock/module/PostGridCard';
import PostGridCard from '@/tests/mock/module/PostGridCard';
import usePosts from '@/tests/mock/module/usePosts';

import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GridSpinner from '@/components/ui/GridSpinner';
import PostGrid from '@/components/PostGrid';
import { fakeSimplePosts } from '@/tests/mock/post/post';

jest.mock('@/components/ui/GridSpinner');

describe('PostGrid', () => {
  beforeEach(() => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: fakeSimplePosts,
      isLoading: false,
    }));
  });
  afterEach(() => {
    (GridSpinner as jest.Mock).mockReset();
    (PostGridCard as jest.Mock).mockReset();
    (usePosts as jest.Mock).mockReset();
  });

  it('should display loading spinner when a loading flag is set to true', async () => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: fakeSimplePosts,
      isLoading: true,
    }));

    render(<PostGrid />);

    expect(GridSpinner).toHaveBeenCalledTimes(1);
  });

  it('should not display loading spinner when a loading flag is set to false', async () => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: fakeSimplePosts,
      isLoading: false,
    }));

    render(<PostGrid />);

    expect(GridSpinner).not.toHaveBeenCalled();
  });

  it('should invoke PostGridCard with a post when a posts is provided', async () => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: fakeSimplePosts,
      isLoading: false,
    }));

    render(<PostGrid />);
    await waitFor(() => {}, { timeout: 1 });

    expect(PostGridCard).toHaveBeenCalledTimes(fakeSimplePosts.length);
    expect((PostGridCard as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePosts[0]
    );
    expect((PostGridCard as jest.Mock).mock.calls[1][0].post).toEqual(
      fakeSimplePosts[1]
    );
    expect((PostGridCard as jest.Mock).mock.calls[2][0].post).toEqual(
      fakeSimplePosts[2]
    );
  });

  it.only('should not invoke PostGridCard when a posts is not provided', async () => {
    (usePosts as jest.Mock).mockImplementation(() => ({
      posts: undefined,
      isLoading: false,
    }));

    render(<PostGrid />);
    await waitFor(() => {}, { timeout: 1 });

    expect(PostGridCard).not.toBeCalled();
  });
});
