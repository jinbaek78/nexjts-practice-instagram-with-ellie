import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import BookMarkIcon from '@/components/ui/icons/BookmarkIcon';
import { HeartIcon } from '@/components/ui/icons';
import { parseDate } from '@/util/date';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import ActionBar from '@/components/ActionBar';

jest.mock('@/util/date');
jest.mock('@/components/ui/icons');
jest.mock('@/components/ui/icons/BookmarkIcon');

describe('ActionBar', () => {
  const fakeSimplePostWithOneLikes = fakeSimplePosts[0];
  const fakeSimplePostWithTwoLikes = fakeSimplePosts[1];

  afterEach(() => {
    (parseDate as jest.Mock).mockReset();
  });

  it('should render correctly', () => {
    const { likes, username, text, createdAt } = fakeSimplePostWithOneLikes;
    render(
      <ActionBar
        likes={likes}
        username={username}
        text={text}
        createdAt={createdAt}
      />
    );

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(parseDate).toHaveBeenCalledTimes(1);
    expect(parseDate).toHaveBeenLastCalledWith(createdAt);
    expect(screen.getByText(`${likes.length} like`)).toBeInTheDocument();
  });
  it('should display the likes statement when there is more than one like', () => {
    const { likes, username, text, createdAt } = fakeSimplePostWithTwoLikes;
    render(
      <ActionBar
        likes={likes}
        username={username}
        text={text}
        createdAt={createdAt}
      />
    );
    expect(screen.getByText(`${likes.length} likes`)).toBeInTheDocument();
  });
  it('should display a comment when a text is provided', () => {
    const { likes, username, text, createdAt } = fakeSimplePostWithOneLikes;
    render(
      <ActionBar
        likes={likes}
        username={username}
        text={text}
        createdAt={createdAt}
      />
    );

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should not display a comment when a text is not provided', () => {
    const { likes, username, text, createdAt } = fakeSimplePostWithOneLikes;
    render(
      <ActionBar likes={likes} username={username} createdAt={createdAt} />
    );

    expect(screen.queryByText(username)).toBeNull();
    expect(screen.queryByText(text)).toBeNull();
  });
});
