import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GridSpinner from '@/components/ui/GridSpinner';
import PostGridCard from '@/components/PostGridCard';
import { SWRConfig } from 'swr';
import PostGrid from '@/components/PostGrid';
import { fakeSimplePosts } from '@/tests/mock/post/post';

jest.mock('@/components/ui/GridSpinner');
jest.mock('@/components/PostGridCard');

describe('PostGrid', () => {
  afterEach(() => {
    (GridSpinner as jest.Mock).mockReset();
    (PostGridCard as jest.Mock).mockReset();
  });

  ('it should fetch using the correct URL containing the provided props,');

  it('should fetch using the correct URL containing the provided props', async () => {
    const fetcher = jest.fn(async (url) => fakeSimplePosts);
    const username = 'testUserName';
    const query = 'posts';
    const url = `/api/users/${username}/${query}`;
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostGrid username={username} query={query} />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(url);
  });

  it('should invoke loading spinner at first', async () => {
    const fetcher = jest.fn(async (url) => null);
    const username = 'testUserName';
    const query = 'posts';

    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostGrid username={username} query={query} />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(GridSpinner).toHaveBeenCalledTimes(1);
  });

  it('should invoke PostGridCard with a post when a posts is provided', async () => {
    const fetcher = jest.fn(async (url) => fakeSimplePosts);
    const username = 'testUserName';
    const query = 'posts';

    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostGrid username={username} query={query} />
      </SWRConfig>
    );
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

  it('should not invoke PostGridCard when a posts is not  provided', async () => {
    const fetcher = jest.fn(async (url) => null);
    const username = 'testUserName';
    const query = 'posts';
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostGrid username={username} query={query} />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(PostGridCard).not.toBeCalled();
  });
});
