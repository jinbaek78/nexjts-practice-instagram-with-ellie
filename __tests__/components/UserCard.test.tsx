import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Avatar from '@/components/ui/Avatar';
import { fakeProfileUser } from '@/tests/mock/user/users';
import UserCard from '@/components/UserCard';

jest.mock('@/components/ui/Avatar');

describe('UserCard', () => {
  const { name, username, image, following, followers } = fakeProfileUser;
  const FOLLOWING_FOLLOWERS_TEXT = `${followers} followers ${following} following`;

  afterEach(() => {
    (Avatar as jest.Mock).mockReset();
  });
  it('should render correctly with provided props', () => {
    render(<UserCard user={fakeProfileUser} />);

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].image).toBe(image);
    expect(screen.getByText(FOLLOWING_FOLLOWERS_TEXT)).toBeInTheDocument();
  });
  it('should navigate to user page correctly when a user card is clicked', async () => {
    render(<UserCard user={fakeProfileUser} />, {
      wrapper: MemoryRouterProvider,
    });
    const userCard = screen.getByRole('link');
    const path = `/user/${username}`;

    await userEvent.click(userCard);

    expect(mockRouter.asPath).toBe(path);
  });
});
