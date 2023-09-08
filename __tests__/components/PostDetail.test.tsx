import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import PostUserAvatar from '@/components/PostUserAvatar';
import ActionBar from '@/components/ActionBar';
import { fakeFullPost, fakeSimplePost } from '@/tests/mock/post/post';
import { SWRConfig } from 'swr';
import PostDetail from '@/components/PostDetail';

jest.mock('@/components/PostUserAvatar');
jest.mock('@/components/ActionBar');
jest.mock('@/components/ui/Avatar');
jest.mock(
  'next/image',
  () =>
    function Image({ src }: { src: string }) {
      return mockedImage(src);
    }
);

const mockedImage = jest.fn();

describe('PostDetail', () => {
  it('should render correctly', async () => {
    const { id, userImage, username, image, createdAt, likes } = fakeSimplePost;
    const fetcher = jest.fn(async (url) => fakeFullPost);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <PostDetail post={fakeSimplePost} />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(`/api/posts/${id}`);
    expect(PostUserAvatar).toHaveBeenCalledTimes(2);
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].userImage).toBe(
      userImage
    );
    expect((PostUserAvatar as jest.Mock).mock.calls[0][0].username).toBe(
      username
    );
    expect(mockedImage).toHaveBeenCalledTimes(2);
    expect(mockedImage.mock.calls[0][0]).toBe(image);
    expect(ActionBar).toHaveBeenCalledTimes(2);
    expect((ActionBar as jest.Mock).mock.calls[0][0].post).toEqual(
      fakeSimplePost
    );
  });
});
