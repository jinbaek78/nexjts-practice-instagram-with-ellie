import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SmileIcon from '@/components/ui/icons/SmileIcon';
import CommentForm from '@/components/CommentForm';
import React from 'react';

jest.mock('@/components/ui/icons/SmileIcon');
jest.spyOn(React, 'useState');

describe('CommentForm', () => {
  const onPostComment = jest.fn((comment: string) => {});

  afterEach(() => {
    onPostComment.mockClear();
    (React.useState as jest.Mock).mockClear();
  });
  it('should invokes onPostComment when submit button is clicked', async () => {
    render(<CommentForm onPostComment={onPostComment} />);
    const postButton = screen.getByRole('button');
    const input = screen.getByRole('textbox');
    const testText = 'test';
    const expectedCallTimesOfSetState = 1 + testText.length + 1;

    await userEvent.type(input, testText);
    await userEvent.click(postButton);

    expect(onPostComment).toHaveBeenCalledTimes(1);
    expect(onPostComment).toHaveBeenLastCalledWith(testText);
    expect(React.useState).toHaveBeenCalledTimes(expectedCallTimesOfSetState);
  });

  it('should invokes onPostComment when the comment input is not empty and the enter key is pressed', async () => {
    render(<CommentForm onPostComment={onPostComment} />);
    const input = screen.getByRole('textbox');
    const testText = 'test';
    const expectedCallTimesOfSetState = 1 + testText.length + 1;

    await userEvent.type(input, testText);
    await userEvent.keyboard('{enter}');

    expect(onPostComment).toHaveBeenCalledTimes(1);
    expect(onPostComment).toHaveBeenLastCalledWith(testText);
    expect(React.useState).toHaveBeenCalledTimes(expectedCallTimesOfSetState);
  });

  it('should not invoke onPostComment when the comment input is empty and the enter key is pressed', async () => {
    render(<CommentForm onPostComment={onPostComment} />);
    const input = screen.getByRole('textbox');

    input.focus();
    await userEvent.keyboard('{enter}');

    expect(onPostComment).not.toBeCalled();
  });
});
