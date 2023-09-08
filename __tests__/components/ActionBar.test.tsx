import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
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
import { useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/user/session';

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
describe('ActionBar', () => {
  const fakeSimplePostWithOneLikes = fakeSimplePosts[0];
  const fakeSimplePostWithTwoLikes = fakeSimplePosts[1];
  const fakeSimplePostWithoutText = fakeSimplePosts[2];
  const setLike = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    (usePosts as jest.Mock).mockImplementation(() => ({ setLike }));
  });

  afterEach(() => {
    (parseDate as jest.Mock).mockReset();
    (ToggleButton as jest.Mock).mockReset();
    (useSession as jest.Mock).mockReset();
  });

  it('should render correctly', () => {
    const { likes, username, text, createdAt } = fakeSimplePostWithOneLikes;
    render(<ActionBar post={fakeSimplePostWithOneLikes} />);

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(parseDate).toHaveBeenCalledTimes(1);
    expect(parseDate).toHaveBeenLastCalledWith(createdAt);
    expect(screen.getByText(`${likes.length} like`)).toBeInTheDocument();
    expect(ToggleButton).toHaveBeenCalledTimes(2);
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
    // 📌 add  post with text = undefined ÷
    const { username } = fakeSimplePostWithoutText;
    render(<ActionBar post={fakeSimplePostWithoutText} />);

    expect(screen.queryByText(username)).toBeNull();
  });
});
