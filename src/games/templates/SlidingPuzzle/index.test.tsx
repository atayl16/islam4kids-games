import { render, screen } from '@testing-library/react';
import { SlidingPuzzleGame } from './index';
import '@testing-library/jest-dom';

describe('SlidingPuzzleGame', () => {
  const mockOnComplete = jest.fn();
  const mockOnScoreChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game board', () => {
    render(
      <SlidingPuzzleGame
        difficulty="easy"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('Shuffle')).toBeInTheDocument();
    expect(screen.getByText('Moves:')).toBeInTheDocument();
  });

  it('displays correct difficulty level', () => {
    render(
      <SlidingPuzzleGame
        difficulty="hard"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('hard (5x5)')).toBeInTheDocument();
  });

  it('shows initial move count of 0', () => {
    render(
      <SlidingPuzzleGame
        difficulty="easy"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays instructions', () => {
    render(
      <SlidingPuzzleGame
        difficulty="easy"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText(/Click on tiles adjacent to the empty space/)).toBeInTheDocument();
  });

  it('shows grid size indicator', () => {
    render(
      <SlidingPuzzleGame
        difficulty="medium"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('medium (4x4)')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <SlidingPuzzleGame
        difficulty="easy"
        imageSlug="kaaba"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Should show loading initially
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });
});
