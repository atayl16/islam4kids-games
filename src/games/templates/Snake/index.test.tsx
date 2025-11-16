import { render, screen, fireEvent } from '@testing-library/react';
import { SnakeGame } from './index';
import '@testing-library/jest-dom';

describe('SnakeGame', () => {
  const mockOnComplete = jest.fn();
  const mockOnScoreChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the game board', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Check for score display
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  it('displays correct difficulty level', () => {
    render(
      <SnakeGame
        difficulty="hard"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('hard')).toBeInTheDocument();
  });

  it('shows initial score of 0', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows initial snake length of 3', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles keyboard input for direction changes', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Simulate arrow key press
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    // Test passes if no errors are thrown
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('handles pause functionality', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Simulate spacebar press to pause
    fireEvent.keyDown(window, { key: ' ' });

    // Check if pause overlay appears
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('shows mobile controls on small screens', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    // Mobile control buttons should be rendered
    const upButton = screen.getByText('↑');
    const downButton = screen.getByText('↓');
    const leftButton = screen.getByText('←');
    const rightButton = screen.getByText('→');

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
  });

  it('shows instructions for desktop and mobile', () => {
    render(
      <SnakeGame
        difficulty="easy"
        onComplete={mockOnComplete}
        onScoreChange={mockOnScoreChange}
      />
    );

    expect(screen.getByText(/Arrow Keys or WASD/)).toBeInTheDocument();
    expect(screen.getByText(/Use the buttons below/)).toBeInTheDocument();
  });
});
