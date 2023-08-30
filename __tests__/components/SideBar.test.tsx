import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/ui/Avatar';
import SideBar from '@/components/SideBar';
import { fakeSession } from '@/tests/mock/user/session';

jest.mock('@/components/ui/Avatar');

describe('SideBar', () => {
  const { name, username, image } = fakeSession.user;

  afterEach(() => {
    (Avatar as jest.Mock).mockReset();
  });

  it('should render with props correctly', () => {
    const avatarArguments = { image };
    render(<SideBar user={fakeSession.user} />);

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(Avatar).toHaveBeenCalledTimes(1);
    expect(Avatar).toHaveBeenCalledWith(avatarArguments, {});
  });

  it('should not invoke avatar component when an image is not available', () => {
    const fakeSessionWithoutImage = {
      ...fakeSession,
      user: {
        ...fakeSession.user,
        image: undefined,
      },
    };
    render(<SideBar user={fakeSessionWithoutImage.user} />);

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(Avatar).not.toBeCalled();
  });
});
