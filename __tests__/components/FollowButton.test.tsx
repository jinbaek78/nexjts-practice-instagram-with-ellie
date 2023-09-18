import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import FollowButton from '@/components/FollowButton';
import {
  fakeHomeUser,
  fakeProfileUser,
  fakeProfileUsers,
} from '@/tests/mock/user/users';
import Button from '@/components/ui/Button';
import useMe from '@/hooks/me';
import { HomeUser, ProfileUser } from '@/model/user';

jest.mock('@/components/ui/Button');
jest.mock('@/hooks/me');

describe('FollowButton', () => {
  const UNFOLLOW_TEXT = 'Unfollow';
  const FOLLOW_TEXT = 'Follow';
  const fetcher = jest.fn(async () => fakeHomeUser);

  beforeEach(() => {
    fetcher.mockImplementation(async () => fakeHomeUser);
    (useMe as jest.Mock).mockImplementation(() => ({ user: fakeHomeUser }));
  });
  afterEach(() => {
    (Button as jest.Mock).mockReset();
    (useMe as jest.Mock).mockReset();
    fetcher.mockReset();
  });
  it('should not invoke Button component when a user is logged out', async () => {
    (useMe as jest.Mock).mockImplementation(() => ({ user: undefined }));

    const user = fakeProfileUsers[0];
    render(<FollowButton user={user} />);

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).not.toBeCalled();
  });

  it('should not invoke Button component when a user is same as currently logged in User', async () => {
    const user = { ...fakeProfileUsers[0], username: fakeHomeUser.username };
    render(<FollowButton user={user} />);

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).not.toBeCalled();
  });

  it("should invoke Button component with Unfollow text when a user is in the list of logged-in user's following list", async () => {
    const user = fakeProfileUsers[0];
    render(<FollowButton user={user} />);

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe(UNFOLLOW_TEXT);
  });

  it("should invoke Button component with Follow text when a user is not in the list of logged-in user's following list", async () => {
    const user = fakeProfileUsers[1];
    render(<FollowButton user={user} />);

    await waitFor(() => {}, { timeout: 1 });

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe(FOLLOW_TEXT);
  });
});
