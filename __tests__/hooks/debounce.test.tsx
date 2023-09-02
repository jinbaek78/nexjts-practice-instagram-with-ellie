import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import useDebounce from '@/hooks/debounce';
import { useState as useStateMock } from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.useFakeTimers({ timerLimit: 10 });
jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');

describe('debounce', () => {
  const setDebounced = jest.fn();
  const DELAYED_TIME = 10;
  const FIRST_KEYWORD = 't';
  const SECOND_KEYWORD = 'te';
  const THIRD_KEYWORD = 'tes';
  const LAST_KEYWORD = 'test';
  const callTimes = LAST_KEYWORD.length;

  it('Should invoke the callback in setTimeout with last typed keyword only once when the user has finished typing', async () => {
    (useStateMock as jest.Mock).mockImplementation(() => [
      FIRST_KEYWORD,
      setDebounced,
    ]);
    const { rerender } = renderHook(
      ({ value }) => useDebounce(value, DELAYED_TIME),
      {
        initialProps: { value: FIRST_KEYWORD },
      }
    );
    rerender({ value: SECOND_KEYWORD });
    rerender({ value: THIRD_KEYWORD });
    rerender({ value: LAST_KEYWORD });
    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(callTimes);
    expect(clearTimeout).toHaveBeenCalledTimes(callTimes - 1);
    expect(setDebounced).toHaveBeenCalledTimes(1);
    expect(setDebounced).toHaveBeenCalledWith(LAST_KEYWORD);
  });
});
