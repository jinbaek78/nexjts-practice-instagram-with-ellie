import '@/tests/mock/module/ActionBar';
import ActionBar from '@/tests/mock/module/ActionBar';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/ui/Avatar';
import Image from 'next/image';
import CommentForm from '@/components/CommentForm';
// import ActionBar from '@/components/ActionBar';
import { fakeSimplePosts } from '@/tests/mock/post/post';
import PostListCard from '@/components/PostListCard';
import PostUserAvatar from '@/components/PostUserAvatar';

jest.mock('@/components/ui/Avatar');
jest.mock('@/components/CommentForm');
jest.mock('@/components/PostUserAvatar');

jest.mock(
  'next/image',
  () =>
    function Image({ src, priority }: { src: string; priority: boolean }) {
      return mockedImage(src, priority);
    }
);

const mockedImage = jest.fn();

describe('PostListCard', () => {
  const fakeSimplePost = fakeSimplePosts[0];
  const { userImage, username, image, createdAt, likes, text } = fakeSimplePost;
  const priority = true;

  it('should render correctly', () => {
    render(<PostListCard post={fakeSimplePost} priority={priority} />);

    expect(PostUserAvatar).toHaveBeenCalledTimes(1);
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].userImage).toBe(
      userImage
    );
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].username).toBe(
      username
    );
    expect(mockedImage).toHaveBeenCalledTimes(1);
    expect(mockedImage.mock.calls[0][0]).toBe(image);
    expect(mockedImage.mock.calls[0][1]).toBe(priority);
    expect(ActionBar).toBeCalledTimes(1);
    expect((ActionBar as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePost
    );
  });

  //
});
