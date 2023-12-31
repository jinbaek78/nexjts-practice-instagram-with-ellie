import '@/tests/mock/module/PostDetail';
import PostDetail from '@/tests/mock/module/PostDetail';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ModalPortal from '@/components/ui/ModalPortal';
import PostModal from '@/components/PostModal';
import { signIn, useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/user/session';
import PostGridCard from '@/components/PostGridCard';
import { fakeSimplePost } from '@/tests/mock/post/post';

jest.mock('@/components/ui/ModalPortal');
jest.mock('@/components/PostModal');
jest.mock('@/components/PostModal');
jest.mock('next-auth/react');

describe('PostGridCard', () => {
  afterEach(() => {
    (signIn as jest.Mock).mockReset();
    (useSession as jest.Mock).mockReset();
  });
  it('should render correctly', () => {
    const { image, username } = fakeSimplePost;
    (useSession as jest.Mock).mockImplementation(() => ({
      data: fakeSession,
    }));

    render(<PostGridCard post={fakeSimplePost} priority={false} />);

    const imageElement = screen.getByRole('img') as HTMLImageElement;
    expect(useSession).toHaveBeenCalledTimes(1);
    expect(imageElement.src).toContain(image.split('/')[1]);
    expect(imageElement.alt).toBe(`photo by ${username}`);
  });

  it('should invoke signIn component when a user is logged out and clicks a post image', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: null,
    }));
    render(<PostGridCard post={fakeSimplePost} priority={false} />);
    const imageElement = screen.getByRole('img') as HTMLImageElement;

    await userEvent.click(imageElement);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(ModalPortal).not.toBeCalled();
  });

  it('should invoke modal when a user is logged in and clicks a post image', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: fakeSession,
    }));
    render(<PostGridCard post={fakeSimplePost} priority={false} />);
    const imageElement = screen.getByRole('img') as HTMLImageElement;

    await userEvent.click(imageElement);

    expect(signIn).not.toBeCalled();
    expect(ModalPortal).toHaveBeenCalledTimes(1);
  });
});
