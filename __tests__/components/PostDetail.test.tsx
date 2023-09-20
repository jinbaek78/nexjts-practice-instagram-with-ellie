import '@/tests/mock/module/ActionBar';
import ActionBar from '@/tests/mock/module/ActionBar';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostUserAvatar from '@/components/PostUserAvatar';
import { fakeFullPost, fakeSimplePost } from '@/tests/mock/post/post';
import PostDetail from '@/components/PostDetail';
import useFullPost from '@/hooks/post';
import { Comment } from '@/model/post';
import Avatar from '@/components/ui/Avatar';

jest.mock('@/components/PostUserAvatar');
jest.mock('@/components/ui/Avatar');
jest.mock('@/hooks/post');
jest.mock(
  'next/image',
  () =>
    function Image({ src }: { src: string }) {
      return mockedImage(src);
    }
);

const mockedImage = jest.fn();
const postComment = (comment: Comment): Promise<any> | undefined => {
  return undefined;
};

describe('PostDetail', () => {
  afterEach(() => {
    (useFullPost as jest.Mock).mockReset();
    (PostUserAvatar as jest.Mock).mockReset();
    (ActionBar as jest.Mock).mockReset();
    (Avatar as jest.Mock).mockReset();
    (mockedImage as jest.Mock).mockClear();
  });
  it('renders correctly', async () => {
    const { userImage, username, image } = fakeSimplePost;
    (useFullPost as jest.Mock).mockImplementation(() => ({
      post: fakeFullPost,
      postComment,
    }));

    render(<PostDetail post={fakeSimplePost} />);

    expect(mockedImage).toHaveBeenCalledTimes(1);
    expect(mockedImage.mock.calls[0][0]).toBe(image);
    expect(PostUserAvatar).toHaveBeenCalledTimes(1);
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].userImage).toBe(
      userImage
    );
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].username).toBe(
      username
    );
    expect(Avatar).toHaveBeenCalledTimes(fakeFullPost.comments.length);
    expect(ActionBar).toHaveBeenCalledTimes(1);
    expect((ActionBar as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePost
    );
    expect((ActionBar as jest.Mock).mock.calls[0][0].onComment).toEqual(
      postComment
    );
  });

  it('does not display comments when there are no comments', () => {
    (useFullPost as jest.Mock).mockImplementation(() => ({
      post: { ...fakeFullPost, comments: null },
      postComment,
    }));

    render(<PostDetail post={fakeSimplePost} />);

    expect(Avatar).not.toHaveBeenCalled();
  });
});
