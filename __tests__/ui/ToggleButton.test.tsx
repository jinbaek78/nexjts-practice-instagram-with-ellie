import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ToggleButton from '@/components/ui/ToggleButton';

describe('ToggleButton', () => {
  //
  const onToggle = jest.fn();
  const onIcon = <li>onIcon</li>;
  const offIcon = <li>offIcon</li>;
  const ONICON_TEXT = 'onIcon';
  const OFFICON_TEXT = 'offIcon';

  afterEach(() => {
    onToggle.mockClear();
  });
  it('should invoke onClick method when a toggle button is clicked', async () => {
    const toggled = true;
    renderToggleButton(toggled);
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(!toggled);
  });
  it('should display onIcon component when a toggled flag is set to true', async () => {
    const toggled = true;
    renderToggleButton(toggled);

    expect(screen.getByText(ONICON_TEXT)).toBeInTheDocument();
  });
  it('should display offIcon component when a toggled flag is set to false', async () => {
    const toggled = false;
    renderToggleButton(toggled);

    expect(screen.getByText(OFFICON_TEXT)).toBeInTheDocument();
  });

  function renderToggleButton(toggled: boolean) {
    render(
      <ToggleButton
        offIcon={offIcon}
        onIcon={onIcon}
        onToggle={onToggle}
        toggled={toggled}
      />
    );
  }
});
