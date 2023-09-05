import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BookMarkIcon, HeartIcon, PostIcon } from '@/components/ui/icons';
import PostGrid from '@/components/PostGrid';
import UserPosts from '@/components/UserPosts';
import { fakeProfileUser } from '@/tests/mock/user/users';

jest.mock('@/components/ui/icons');
jest.mock('@/components/PostGrid');

describe('UserPosts', () => {
  afterEach(() => {
    (PostGrid as jest.Mock).mockReset();
  });

  it('should invoke PostGrid component with liked query when a user clicks liked button', async () => {
    const INITIAL_QUERY = 'posts';
    const UPDATED_QUERY = 'liked';
    const LIKED_TEXT = 'liked';
    render(<UserPosts user={fakeProfileUser} />);
    await waitFor(() => {}, { timeout: 1 });
    const likeElement = screen.getByText(LIKED_TEXT);

    await userEvent.click(likeElement);

    expect(PostGrid).toHaveBeenCalledTimes(2);
    expect((PostGrid as jest.Mock).mock.calls[0][0].query).toBe(INITIAL_QUERY);
    expect((PostGrid as jest.Mock).mock.calls[1][0].query).toBe(UPDATED_QUERY);
  });

  it('should invoke PostGrid component with saved query when a user clicks saved button  ', async () => {
    const INITIAL_QUERY = 'posts';
    const UPDATED_QUERY = 'saved';
    const SAVED_TEXT = 'saved';
    render(<UserPosts user={fakeProfileUser} />);
    await waitFor(() => {}, { timeout: 1 });
    const likeElement = screen.getByText(SAVED_TEXT);

    await userEvent.click(likeElement);

    expect(PostGrid).toHaveBeenCalledTimes(2);
    expect((PostGrid as jest.Mock).mock.calls[0][0].query).toBe(INITIAL_QUERY);
    expect((PostGrid as jest.Mock).mock.calls[1][0].query).toBe(UPDATED_QUERY);
  });
});
