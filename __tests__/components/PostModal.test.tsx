import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { CloseIcon } from '@/components/ui/icons';
import PostModal from '@/components/PostModal';

describe('PostModal', () => {
  const onClose = jest.fn();
  const testKeyword = 'test';
  const children = <div>{testKeyword}</div>;

  afterEach(() => {
    onClose.mockReset();
  });
  it('should render correctly', () => {
    render(<PostModal onClose={onClose}>{children}</PostModal>);

    expect(screen.getByText(testKeyword)).toBeInTheDocument();
  });

  it('should invoke onClose method when the button is clicked', async () => {
    render(<PostModal onClose={onClose}>{children}</PostModal>);
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should invoke onClose method when the post modal section is clicked', async () => {
    render(<PostModal onClose={onClose}>{children}</PostModal>);
    const modalSection = screen.getByTestId('modalSection');

    await userEvent.click(modalSection);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not invoke onClose method when the children section is clicked', async () => {
    render(<PostModal onClose={onClose}>{children}</PostModal>);
    const childrenSection = screen.getByTestId('childrenSection');

    await userEvent.click(childrenSection);

    expect(onClose).not.toBeCalled();
  });
});
