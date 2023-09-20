import '@/tests/mock/module/usePosts';
import '@/tests/mock/module/ActionBar';
import usePosts from '@/tests/mock/module/usePosts';
import ActionBar from '@/tests/mock/module/ActionBar';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { fakeSimplePosts } from '@/tests/mock/post/post';
import PostListCard from '@/components/PostListCard';
import PostUserAvatar from '@/components/PostUserAvatar';
import PostModal from '@/components/PostModal';
import PostDetail from '@/components/PostDetail';
import ModalPortal from '@/components/ui/ModalPortal';
import userEvent from '@testing-library/user-event';
jest.mock('@/components/PostUserAvatar');
jest.mock('@/components/PostModal');
jest.mock('@/components/PostDetail');
jest.mock('@/components/ui/ModalPortal');

describe('PostListCard', () => {
  const fakeSimplePost = fakeSimplePosts[0];
  const { userImage, username, image: imageUrl, text } = fakeSimplePost;
  const priority = true;

  beforeEach(() => {
    (ActionBar as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => children
    );
    (ModalPortal as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => children
    );
    (PostModal as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => children
    );
    (usePosts as jest.Mock).mockImplementation(() => ({
      postComment: () => {},
    }));
  });

  afterEach(() => {
    (ActionBar as jest.Mock).mockReset();
    (ModalPortal as jest.Mock).mockReset();
    (PostModal as jest.Mock).mockReset();
    (PostDetail as jest.Mock).mockReset();
    (usePosts as jest.Mock).mockReset();
  });

  it('should correctly render the component with provided props', () => {
    render(<PostListCard post={fakeSimplePost} priority={priority} />);
    const image = screen.getByRole('img') as HTMLImageElement;

    expect(PostUserAvatar).toHaveBeenCalledTimes(1);
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].userImage).toBe(
      userImage
    );
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].username).toBe(
      username
    );
    const imageUrlString = imageUrl.split('/')[1];
    expect(image.src).toMatch(imageUrlString);
    expect(ActionBar).toBeCalledTimes(1);
    expect((ActionBar as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePost
    );
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should not display 'View All comments'string when the length of comments less than 2", () => {
    const comments = 1;
    const expectedString = `View all ${comments} comments`;
    render(
      <PostListCard
        post={{ ...fakeSimplePost, comments }}
        priority={priority}
      />
    );

    expect(screen.queryByText(expectedString)).toBeNull();
  });

  it("should  display 'View All comments'string when the length of comments greater than or equal 2", () => {
    const comments = 2;
    const expectedString = `View all ${comments} comments`;
    render(
      <PostListCard
        post={{ ...fakeSimplePost, comments }}
        priority={priority}
      />
    );

    expect(screen.getByText(expectedString)).toBeInTheDocument();
  });

  it('should not invoke PostDetail component when a post Image is not clicked', () => {
    render(<PostListCard post={fakeSimplePost} priority={priority} />);

    expect(PostDetail).not.toHaveBeenCalled();
  });

  it('should invoke PostDetail component when a post Image is clicked', async () => {
    render(<PostListCard post={fakeSimplePost} priority={priority} />);
    const image = screen.getByRole('img');

    await userEvent.click(image);

    expect(PostDetail).toHaveBeenCalledTimes(1);
    expect(PostDetail).toHaveBeenCalledWith({ post: fakeSimplePost }, {});
  });
});
