import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectFourGame } from './index';
import '@testing-library/jest-dom';

describe('ConnectFourGame', () => {
  const mockOnComplete = jest.fn();
  const mockOnScoreChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game board', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Check for game elements
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Current Turn:')).toBeInTheDocument();
    const youLabels = screen.getAllByText('You');
    expect(youLabels.length).toBeGreaterThan(0);
  });

  it('displays correct difficulty level', () => {
    render(
      <ConnectFourGame
        difficulty="hard"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('hard')).toBeInTheDocument();
  });

  it('shows initial move count of 0', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('Moves')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows player indicators', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    const youLabels = screen.getAllByText('You');
    expect(youLabels.length).toBeGreaterThan(0);

    const aiLabels = screen.getAllByText(/AI/);
    expect(aiLabels.length).toBeGreaterThan(0);
  });

  it('displays instructions', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText(/Click on a column to drop your piece/)).toBeInTheDocument();
    expect(screen.getByText(/Connect 4 in a row to win/)).toBeInTheDocument();
  });

  it('shows connect 4 indicator', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('Connect 4 to Win!')).toBeInTheDocument();
  });

  it('renders board with 42 cells (6 rows x 7 columns)', () => {
    const { container } = render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    const cells = container.querySelectorAll('button[class*="aspect-square"]');
    expect(cells.length).toBe(42); // 6 rows * 7 columns
  });

  it('handles new game button click', () => {
    render(
      <ConnectFourGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);

    // After reset, move count should be 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
