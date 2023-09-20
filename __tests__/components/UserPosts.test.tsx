import '@/tests/mock/module/PostGrid';
import PostGrid from '@/tests/mock/module/PostGrid';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BookMarkIcon, HeartIcon, PostIcon } from '@/components/ui/icons';
import UserPosts from '@/components/UserPosts';
import { fakeProfileUser } from '@/tests/mock/user/users';
import { useCacheKeys } from '@/context/CacheKeysContext';

jest.mock('@/components/ui/icons');

describe('UserPosts', () => {
  const LIKED_TEXT = 'liked';
  const SAVED_TEXT = 'saved';

  beforeEach(() => {
    (PostGrid as jest.Mock).mockImplementation(() => {
      const { postsKey } = useCacheKeys();
      return <p>{postsKey}</p>;
    });
  });

  afterEach(() => {
    (PostGrid as jest.Mock).mockReset();
  });

  it('should have cacheKeysContext that has a value containing liked query when a user clicks liked button', async () => {
    const postsKey = `/api/users/${fakeProfileUser.username}/${LIKED_TEXT}`;
    render(<UserPosts user={fakeProfileUser} />);
    await waitFor(() => {}, { timeout: 1 });
    const likeElement = screen.getByText(LIKED_TEXT);

    await userEvent.click(likeElement);

    expect(PostGrid).toHaveBeenCalledTimes(2);
    expect(screen.getByText(postsKey));
  });

  it.only('should have cacheKeysContext that has a value containing saved query when a user clicks saved button', async () => {
    const postsKey = `/api/users/${fakeProfileUser.username}/${SAVED_TEXT}`;
    render(<UserPosts user={fakeProfileUser} />);
    await waitFor(() => {}, { timeout: 1 });
    const savedElement = screen.getByText(SAVED_TEXT);

    await userEvent.click(savedElement);

    expect(PostGrid).toHaveBeenCalledTimes(2);
    expect(screen.getByText(postsKey));
  });
});
