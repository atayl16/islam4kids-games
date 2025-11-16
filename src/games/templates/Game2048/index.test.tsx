import { render, screen } from '@testing-library/react';
import { Game2048 } from './index';
import '@testing-library/jest-dom';

describe('Game2048', () => {
  const mockOnComplete = jest.fn();
  const mockOnScoreChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('renders the game board', () => {
    render(
      <Game2048
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('SCORE')).toBeInTheDocument();
    expect(screen.getByText('BEST')).toBeInTheDocument();
  });

  it('displays correct difficulty level', () => {
    render(
      <Game2048
        difficulty="hard"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('hard (6x6)')).toBeInTheDocument();
  });

  it('shows initial score of 0', () => {
    render(
      <Game2048
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    const scoreElements = screen.getAllByText('0');
    expect(scoreElements.length).toBeGreaterThan(0);
  });

  it('displays instructions', () => {
    render(
      <Game2048
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText(/Use Arrow Keys or WASD/)).toBeInTheDocument();
    expect(screen.getByText(/Reach 2048 to win/)).toBeInTheDocument();
  });

  it('shows mobile controls', () => {
    render(
      <Game2048
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Mobile control buttons
    const upButton = screen.getByText('↑');
    const downButton = screen.getByText('↓');
    const leftButton = screen.getByText('←');
    const rightButton = screen.getByText('→');

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
  });

  it('displays best score from localStorage', () => {
    localStorage.setItem('2048-best-score', '1024');

    render(
      <Game2048
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('1024')).toBeInTheDocument();
  });
});
