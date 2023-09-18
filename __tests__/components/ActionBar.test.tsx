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
import { fakeComment, fakeSimplePosts } from '@/tests/mock/post/post';
import ActionBar from '@/components/ActionBar';
import ToggleButton from '@/components/ui/ToggleButton';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';
import { fakeHomeUsers } from '@/tests/mock/user/users';
import { Comment } from '@/model/post';
import CommentForm from '@/components/CommentForm';

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
jest.mock('@/components/CommentForm');

describe('ActionBar', () => {
  const fakeSimplePostWithOneLikes = fakeSimplePosts[0];
  const fakeSimplePostWithThreeLikes = fakeSimplePosts[1];
  const fakeSimplePostWithoutText = fakeSimplePosts[2];
  const setLike = jest.fn();
  const setBookmark = jest.fn();
  const onComment = (fakeComment: Comment) => {};
  const childrenText = 'children;';
  const children = <p>{childrenText}</p>;

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
    (CommentForm as jest.Mock).mockReset();
  });

  it('should render correctly', () => {
    const { id, likes, createdAt } = fakeSimplePostWithOneLikes;
    const liked = fakeHomeUsers[0]
      ? likes.includes(fakeHomeUsers[0].username)
      : false;
    const bookmarked = fakeHomeUsers[0]?.bookmarks.includes(id) ?? false;

    render(
      <ActionBar onComment={onComment} post={fakeSimplePostWithOneLikes}>
        {children}
      </ActionBar>
    );

    expect(screen.getByText(childrenText)).toBeInTheDocument();
    expect(parseDate).toHaveBeenCalledTimes(1);
    expect(parseDate).toHaveBeenLastCalledWith(createdAt);
    expect(screen.getByText(`${likes.length} like`)).toBeInTheDocument();
    expect(ToggleButton).toHaveBeenCalledTimes(2);
    expect((ToggleButton as jest.Mock).mock.calls[0][0].toggled).toBe(liked);
    expect((ToggleButton as jest.Mock).mock.calls[1][0].toggled).toBe(
      bookmarked
    );
    expect(CommentForm).toHaveBeenCalledTimes(1);
  });
  it('should display the likes statement when there is more than one like', () => {
    const { likes } = fakeSimplePostWithThreeLikes;
    render(
      <ActionBar onComment={onComment} post={fakeSimplePostWithThreeLikes}>
        {children}
      </ActionBar>
    );

    expect(screen.getByText(`${likes.length} likes`)).toBeInTheDocument();
  });
});
