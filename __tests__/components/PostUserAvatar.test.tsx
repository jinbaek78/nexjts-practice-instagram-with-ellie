import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/ui/Avatar';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import PostUserAvatar from '@/components/PostUserAvatar';

jest.mock('@/components/ui/Avatar');

describe('PostUserAvatar', () => {
  const fakePost = fakeSimplePosts[0];
  const { userImage, username } = fakePost;
  it('should render correctly', () => {
    render(<PostUserAvatar userImage={userImage} username={username} />);

    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].image).toBe(userImage);
    expect(screen.getByText(username)).toBeInTheDocument();
  });
});
