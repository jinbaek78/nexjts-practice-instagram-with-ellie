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
import { fakeHomeUser, fakeHomeUsers } from '@/tests/mock/user/users';
import useMe from '@/hooks/me';
import { HomeUser } from '@/model/user';

jest.mock('react-spinners');
jest.mock('@/components/ui/Avatar');
jest.mock('@/components/ui/ScrollableBar');
jest.mock('@/hooks/me');

describe('FollowingBar', () => {
  const fetcher: jest.Mock<Promise<HomeUser | undefined>, [], any> = jest.fn(
    async () => fakeHomeUser
  );

  beforeEach(() => {
    fetcher.mockImplementation(async () => fakeHomeUser);
    (useMe as jest.Mock).mockImplementation(() => ({
      user: fakeHomeUsers[0],
      isLoading: false,
      error: undefined,
    }));
  });

  afterEach(() => {
    fetcher.mockReset();
    (Avatar as jest.Mock).mockReset();
    (PropagateLoader as jest.Mock).mockReset();
    (ScrollableBar as jest.Mock).mockReset();
    (useMe as jest.Mock).mockReset();
  });
  it('should render with loading spinner initially', async () => {
    (useMe as jest.Mock).mockImplementation(() => ({
      user: fakeHomeUsers[0],
      isLoading: true,
      error: undefined,
    }));
    renderFollowingBar(fetcher);

    await waitFor(() => {
      expect(PropagateLoader).toHaveBeenCalled();
    });

    expect(PropagateLoader).toHaveBeenCalledTimes(1);
  });
  it('should invoke the scrollableBar component when a user information is provided', async () => {
    renderFollowingBar(fetcher);

    expect(ScrollableBar).toHaveBeenCalledTimes(1);
  });

  it('should not invoke the scrollableBar component when a user information is not provided', async () => {
    (useMe as jest.Mock).mockImplementation(() => ({
      user: undefined,
      isLoading: true,
      error: undefined,
    }));
    fetcher.mockImplementation(async () => undefined);
    renderFollowingBar(fetcher);

    expect(ScrollableBar).not.toBeCalled();
  });

  function renderFollowingBar(
    fetcher: jest.Mock<Promise<HomeUser | undefined>, [], any>
  ) {
    return render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowingBar />
      </SWRConfig>
    );
  }
});
