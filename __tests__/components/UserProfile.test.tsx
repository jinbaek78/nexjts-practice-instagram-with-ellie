import '@/tests/mock/module/FollowButton';
import FollowButton from '@/tests/mock/module/FollowButton';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/ui/Avatar';
import UserProfile from '@/components/UserProfile';
import { fakeProfileUser } from '@/tests/mock/user/users';

jest.mock('@/components/ui/Avatar');

describe('UserProfile', () => {
  //
  it('should renders correctly', () => {
    const { image, username, name, followers, following, posts } =
      fakeProfileUser;
    render(<UserProfile user={fakeProfileUser} />);

    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].image).toBe(image);
    expect(FollowButton).toHaveBeenCalledTimes(1);
    expect(FollowButton).toHaveBeenCalledWith({ user: fakeProfileUser }, {});
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(followers)).toBeInTheDocument();
    expect(screen.getByText(following)).toBeInTheDocument();
    expect(screen.getByText(posts)).toBeInTheDocument();
  });
});
