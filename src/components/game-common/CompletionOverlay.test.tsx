import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompletionOverlay } from './CompletionOverlay';

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  volume: 0.7,
}));

describe('CompletionOverlay', () => {
  it('does not render when isVisible is false', () => {
    render(<CompletionOverlay isVisible={false} />);
    expect(screen.queryByTestId('completion-overlay')).not.toBeInTheDocument();
  });

  it('renders when isVisible is true', () => {
    render(<CompletionOverlay isVisible={true} />);
    expect(screen.getByTestId('completion-overlay')).toBeInTheDocument();
  });

  it('displays default title and message', () => {
    render(<CompletionOverlay isVisible={true} />);
    expect(screen.getByText('Mashallah! Well Done!')).toBeInTheDocument();
    expect(screen.getByText("You've completed the game!")).toBeInTheDocument();
  });

  it('displays custom title and message', () => {
    render(
      <CompletionOverlay
        isVisible={true}
        title="Custom Title"
        message="Custom Message"
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });

  it('renders play again button when onPlayAgain is provided', () => {
    const onPlayAgain = jest.fn();
    render(<CompletionOverlay isVisible={true} onPlayAgain={onPlayAgain} />);

    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    expect(playAgainButton).toBeInTheDocument();
  });

  it('does not render play again button when onPlayAgain is not provided', () => {
    render(<CompletionOverlay isVisible={true} />);
    expect(screen.queryByRole('button', { name: /play again/i })).not.toBeInTheDocument();
  });

  it('calls onPlayAgain when play again button is clicked', async () => {
    const onPlayAgain = jest.fn();
    const user = userEvent.setup();

    render(<CompletionOverlay isVisible={true} onPlayAgain={onPlayAgain} />);

    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    await user.click(playAgainButton);

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('renders close button', () => {
    render(<CompletionOverlay isVisible={true} />);
    const closeButton = screen.getByRole('button', { name: /close overlay/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls setIsVisible when close button is clicked', async () => {
    const setIsVisible = jest.fn();
    const user = userEvent.setup();

    render(<CompletionOverlay isVisible={true} setIsVisible={setIsVisible} />);

    const closeButton = screen.getByRole('button', { name: /close overlay/i });
    await user.click(closeButton);

    expect(setIsVisible).toHaveBeenCalledWith(false);
  });

  it('renders children when provided', () => {
    render(
      <CompletionOverlay isVisible={true}>
        <div data-testid="custom-child">Custom Child Content</div>
      </CompletionOverlay>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom Child Content')).toBeInTheDocument();
  });

  it('plays sound effect when becoming visible', () => {
    const { rerender } = render(<CompletionOverlay isVisible={false} />);

    expect(global.Audio).not.toHaveBeenCalled();

    rerender(<CompletionOverlay isVisible={true} soundEffect="/audio/test.mp3" />);

    expect(global.Audio).toHaveBeenCalledWith('/audio/test.mp3');
  });

  it('closes when clicking outside the overlay content', () => {
    const setIsVisible = jest.fn();
    const { container } = render(
      <CompletionOverlay isVisible={true} setIsVisible={setIsVisible} />
    );

    const overlay = container.querySelector('.completion-overlay');
    if (overlay) {
      fireEvent.mouseDown(overlay);
      expect(setIsVisible).toHaveBeenCalledWith(false);
    }
  });

  it('does not close when clicking inside the overlay content', () => {
    const setIsVisible = jest.fn();
    const { container } = render(
      <CompletionOverlay isVisible={true} setIsVisible={setIsVisible} />
    );

    const overlayContent = container.querySelector('.completion-overlay-content');
    if (overlayContent) {
      fireEvent.mouseDown(overlayContent);
      expect(setIsVisible).not.toHaveBeenCalled();
    }
  });
});
