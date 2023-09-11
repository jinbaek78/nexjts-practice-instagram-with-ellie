import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import {
  BookMarkIcon,
  BookmarkFillIcon,
  HeartFillIcon,
  HeartIcon,
} from '@/components/ui/icons';
import { parseDate } from '@/util/date';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import ActionBar from '@/components/ActionBar';
import ToggleButton from '@/components/ui/ToggleButton';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';
import { fakeHomeUsers } from '@/tests/mock/user/users';

jest.mock('@/components/ui/icons', () => ({
  BookMarkIcon: jest.fn(),
  BookmarkFillIcon: jest.fn(),
  HeartFillIcon: jest.fn(),
  HeartIcon: jest.fn(),
}));
jest.mock('@/util/date');
jest.mock('@/components/ui/ToggleButton');
jest.mock('next-auth/react');
jest.mock('@/hooks/posts');
jest.mock('@/hooks/me');

describe('ActionBar', () => {
  const fakeSimplePostWithOneLikes = fakeSimplePosts[0];
  const fakeSimplePostWithTwoLikes = fakeSimplePosts[1];
  const fakeSimplePostWithoutText = fakeSimplePosts[2];
  const setLike = jest.fn();
  const setBookmark = jest.fn();

  beforeEach(() => {
    (usePosts as jest.Mock).mockImplementation(() => ({ setLike }));
    (useMe as jest.Mock).mockImplementation(() => ({
      setBookmark,
      user: fakeHomeUsers[0],
    }));
  });

  afterEach(() => {
    (parseDate as jest.Mock).mockReset();
    (ToggleButton as jest.Mock).mockReset();
    (usePosts as jest.Mock).mockReset();
    (useMe as jest.Mock).mockReset();
  });

  it('should render correctly', () => {
    const { id, likes, username, text, createdAt } = fakeSimplePostWithOneLikes;
    const liked = fakeHomeUsers[0]
      ? likes.includes(fakeHomeUsers[0].username)
      : false;
    const bookmarked = fakeHomeUsers[0]?.bookmarks.includes(id) ?? false;
    render(<ActionBar post={fakeSimplePostWithOneLikes} />);

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(parseDate).toHaveBeenCalledTimes(1);
    expect(parseDate).toHaveBeenLastCalledWith(createdAt);
    expect(screen.getByText(`${likes.length} like`)).toBeInTheDocument();
    expect(ToggleButton).toHaveBeenCalledTimes(2);
    expect((ToggleButton as jest.Mock).mock.calls[0][0].toggled).toBe(liked);
    expect((ToggleButton as jest.Mock).mock.calls[1][0].toggled).toBe(
      bookmarked
    );
  });
  it('should display the likes statement when there is more than one like', () => {
    const { likes } = fakeSimplePostWithTwoLikes;
    render(<ActionBar post={fakeSimplePostWithTwoLikes} />);
    expect(screen.getByText(`${likes.length} likes`)).toBeInTheDocument();
  });
  it('should display a comment when a text is provided', () => {
    const { username, text } = fakeSimplePostWithOneLikes;
    render(<ActionBar post={fakeSimplePostWithOneLikes} />);

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should not display a comment when a text is not provided', () => {
    const { username } = fakeSimplePostWithoutText;
    render(<ActionBar post={fakeSimplePostWithoutText} />);

    expect(screen.queryByText(username)).toBeNull();
  });
});
