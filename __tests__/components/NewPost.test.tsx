import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GridSpinner from '@/components/ui/GridSpinner';
import PostUserAvatar from '@/components/PostUserAvatar';
import NewPost from '@/components/NewPost';
import { fakeAuthUser } from '@/tests/mock/user/users';
import { useRouter } from 'next/navigation';

jest.mock('@/components/ui/GridSpinner');
jest.mock('@/components/PostUserAvatar');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockedPush = jest.fn();

afterEach(() => jest.resetAllMocks());

// 👉 The drag and drop test will be added after I learn how to use Cypress for E2E testing

test('create a new post with a file uploader when a user uploads an image, enters a caption and clicks the publish button', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: 200 });
  const { getByRole, getByTestId } = render(<NewPost user={fakeAuthUser} />);

  // shows an image file with 'local file' alt text  when an image is uploaded properly using the uploader
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });
  const input = getByTestId('input-upload') as HTMLInputElement;

  await userEvent.upload(input, file);

  expect(screen.getByAltText('local file')).toBeInTheDocument();

  // shows a caption when a user writes a caption in the text area
  const textarea = getByRole('textbox') as HTMLTextAreaElement;
  const text = 'test';

  await userEvent.type(textarea, text);

  expect(textarea.value).toBe(text);

  // create a post when the publish button is clicked
  const button = getByRole('button');
  const fetchPath = '/api/posts';

  await userEvent.click(button);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect((fetch as jest.Mock).mock.calls[0][0]).toBe(fetchPath);
  expect(mockedPush).toHaveBeenCalledTimes(1);
  expect(mockedPush).toHaveBeenCalledWith('/');
});
