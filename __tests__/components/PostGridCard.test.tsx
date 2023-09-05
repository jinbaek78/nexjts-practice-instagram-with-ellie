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
jest.mock('next-auth/react');

describe('PostGridCard', () => {
  //1. render correctly : with props: image, username
  //2. redirects to signin page when a user is not logged in and clicks the post image
  // 3. invoke ModalPortal when a user logged in and clicks the post image

  it('should render correctly', () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: fakeSession,
    }));

    render(<PostGridCard post={fakeSimplePost} priority={false} />);

    expect(useSession).toHaveBeenCalledTimes(1);
  });
});
