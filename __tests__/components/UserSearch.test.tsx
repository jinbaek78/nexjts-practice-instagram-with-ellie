import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SWRConfig } from 'swr';
import GridSpinner from '@/components/ui/GridSpinner';
import UserCard from '@/components/UserCard';
import useDebounce from '@/hooks/debounce';
import UserSearch from '@/components/UserSearch';
import { fakeProfileUsers } from '@/tests/mock/user/users';

jest.mock('@/components/ui/GridSpinner');
jest.mock('@/components/UserCard');
jest.mock('@/hooks/debounce');

const DEBOUNCED_KEYWORD = 'test';
const URL = `/api/search/${DEBOUNCED_KEYWORD}`;
const fetcher = jest.fn(async (url) => fakeProfileUsers);

describe('UserSearch', () => {
  afterEach(() => {
    (GridSpinner as jest.Mock).mockReset();
    (UserCard as jest.Mock).mockReset();
    (useDebounce as jest.Mock).mockReset();
    fetcher.mockReset();
  });

  it('should fetch user data with the correct debounced keyword', async () => {
    (useDebounce as jest.Mock).mockImplementation(() => DEBOUNCED_KEYWORD);
    fetcher.mockImplementation(async (url) => fakeProfileUsers);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <UserSearch />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(URL);
  });
  it('should display a loading spinner initially when fetching user data', async () => {
    const GRID_SPINNER_TEXT = 'GridSpinner';
    fetcher.mockImplementation(async (url) => fakeProfileUsers);
    (GridSpinner as jest.Mock).mockImplementation(() => (
      <p>{GRID_SPINNER_TEXT}</p>
    ));
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <UserSearch />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(GridSpinner).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(GRID_SPINNER_TEXT)).toBeNull();
  });

  it('should display an error message when an error occurs during the retrieval of use data', async () => {
    const ERROR_MESSAGE = 'Something went wrong';
    fetcher.mockImplementation(async (url) => {
      throw new Error('error');
    });
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <UserSearch />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
  });

  it('should display a not-found message when there is no matching user', async () => {
    const NOT_FOUND_MESSAGE = 'There is no matched User';
    fetcher.mockImplementation(async (url) => []);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <UserSearch />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(screen.getByText(NOT_FOUND_MESSAGE)).toBeInTheDocument();
  });

  it('should display a user data when a data is available', async () => {
    fetcher.mockImplementation(async (url) => fakeProfileUsers);
    render(
      <SWRConfig value={{ fetcher, provider: () => new Map() }}>
        <UserSearch />
      </SWRConfig>
    );
    await waitFor(() => {}, { timeout: 1 });

    expect(UserCard).toHaveBeenCalledTimes(fakeProfileUsers.length);
    expect(screen.getAllByRole('listitem')).toHaveLength(
      fakeProfileUsers.length
    );
  });
});
