import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import FollowButton from '@/components/FollowButton';
import {
  fakeHomeUser,
  fakeHomeUsers,
  fakeProfileUser,
  fakeProfileUsers,
} from '@/tests/mock/user/users';
import Button from '@/components/ui/Button';

jest.mock('@/components/ui/Button');

describe('FollowButton', () => {
  const UNFOLLOW_TEXT = 'Unfollow';
  const FOLLOW_TEXT = 'Follow';
  afterEach(() => {
    (Button as jest.Mock).mockReset();
  });
  it('should not invoke Button component when a user is logged out', async () => {
    const fetcher = jest.fn(async (url) => null);
    const user = fakeProfileUsers[0];
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowButton user={user} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).not.toBeCalled();
  });

  it('should not invoke Button component when a user is same as currently logged in User', async () => {
    const fetcher = jest.fn(async (url) => fakeHomeUser);
    const user = fakeProfileUser;
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowButton user={user} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).not.toBeCalled();
  });

  it("should invoke Button component with Unfollow text when a user is in the list of logged-in user's following list", async () => {
    const fetcher = jest.fn(async (url) => fakeHomeUser);
    const user = fakeProfileUsers[0];
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowButton user={user} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe(UNFOLLOW_TEXT);
  });

  it("should invoke Button component with Follow text when a user is not in the list of logged-in user's following list", async () => {
    const fetcher = jest.fn(async (url) => fakeHomeUser);
    const user = fakeProfileUsers[1];
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <FollowButton user={user} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe(FOLLOW_TEXT);
  });
});
