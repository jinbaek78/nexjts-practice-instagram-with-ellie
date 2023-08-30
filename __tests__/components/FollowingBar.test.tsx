import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropagateLoader } from 'react-spinners';
import Avatar from '@/components/ui/Avatar';
import ScrollableBar from '@/components/ui/ScrollableBar';
import FollowingBar from '@/components/FollowingBar';
import { SWRConfig } from 'swr';
import { fakeDetailUser } from '@/tests/mock/user/detailUsers';

jest.mock('react-spinners');
jest.mock('@/components/ui/Avatar');
jest.mock('@/components/ui/ScrollableBar');

describe('FollowingBar', () => {
  afterEach(() => {
    (Avatar as jest.Mock).mockReset();
    (PropagateLoader as jest.Mock).mockReset();
    (ScrollableBar as jest.Mock).mockReset();
  });
  it('should render with loading spinner initially', async () => {
    const fetcher = jest.fn(async (url) => fakeDetailUser);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowingBar />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(PropagateLoader).toHaveBeenCalled();
    });

    expect(PropagateLoader).toHaveBeenCalledTimes(1);
  });
  it('should invoke the scrollableBar component when a user information is provided', async () => {
    const fetcher = jest.fn(async (url) => fakeDetailUser);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowingBar />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });
    expect(ScrollableBar).toHaveBeenCalledTimes(1);
  });

  it('should not invoke the scrollableBar component when a user information is not provided', async () => {
    const fetcher = jest.fn(async (url) => undefined);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowingBar />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });
    expect(ScrollableBar).not.toBeCalled();
  });
});
