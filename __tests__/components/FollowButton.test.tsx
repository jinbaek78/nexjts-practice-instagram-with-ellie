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
import revalidateProfileUser from '@/actions/action';
import { PulseLoader } from 'react-spinners';
import React from 'react';

jest.mock('@/components/ui/Button');
jest.mock('@/hooks/me');
jest.mock('@/actions/action');
jest.mock('react-spinners');

jest.spyOn(React, 'useState');

describe('FollowButton', () => {
  const UNFOLLOW_TEXT = 'Unfollow';
  const FOLLOW_TEXT = 'Follow';
  const fetcher = jest.fn(async () => fakeHomeUser);
  const toggleFollow = jest.fn(async () => {});

  beforeEach(() => {
    fetcher.mockImplementation(async () => fakeHomeUser);
    (useMe as jest.Mock).mockImplementation(() => ({
      user: fakeHomeUser,
      toggleFollow,
    }));
    (React.useState as jest.Mock).mockImplementation(() => [false, () => {}]);
  });
  afterEach(() => {
    (Button as jest.Mock).mockReset();
    (useMe as jest.Mock).mockReset();
    (React.useState as jest.Mock).mockReset();
    fetcher.mockReset();
    toggleFollow.mockClear();
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

  it("should not invoke PulseLoader when the 'isFetching' flag is set to false", async () => {
    const user = fakeProfileUsers[1];
    render(<FollowButton user={user} />);

    await waitFor(() => {}, { timeout: 1 });

    expect(PulseLoader).not.toHaveBeenCalled();
  });

  it("should invoke PulseLoader when the 'isFetching' flag is set to true", async () => {
    (React.useState as jest.Mock).mockImplementation(() => [true, () => {}]);
    const user = fakeProfileUsers[1];

    render(<FollowButton user={user} />);

    await waitFor(() => {
      expect(PulseLoader).toHaveBeenCalledTimes(1);
    });
  });

  it("should toggle the user's follow status correctly when the follow/unfollow button is clicked.", async () => {
    const setIsFetching = jest.fn();
    (React.useState as jest.Mock).mockImplementation(() => [
      true,
      setIsFetching,
    ]);
    (Button as jest.Mock).mockImplementation(({ disabled, text, onClick }) => {
      return <button onClick={onClick}></button>;
    });
    const user = fakeProfileUsers[1];
    const { username, id } = user;
    const following = fakeHomeUser.following.find(
      (item) => item.username === username
    );
    render(<FollowButton user={user} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(Button).toHaveBeenCalledTimes(1);
    expect(setIsFetching).toHaveBeenCalledTimes(2);
    // expect(setIsFetching.mock.calls[0][0]).toBe(true);
    expect(setIsFetching).toHaveBeenNthCalledWith(1, true);
    expect(setIsFetching).toHaveBeenNthCalledWith(2, false);
    // expect(setIsFetching.mock.calls[1][0]).toBe(false);
    expect(toggleFollow).toHaveBeenCalledTimes(1);
    expect(toggleFollow).toHaveBeenCalledWith(id, !following);
    expect(revalidateProfileUser).toHaveBeenCalledTimes(1);
    expect(revalidateProfileUser).toHaveBeenCalledWith(username);
  });
});
