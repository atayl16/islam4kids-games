import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PuzzleControls } from './PuzzleControls';

const mockDifficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

describe('PuzzleControls', () => {
  it('renders difficulty selector', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={0}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
      />
    );

    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays progress', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={5}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
      />
    );

    expect(screen.getByText(/5\s*\/\s*10/)).toBeInTheDocument();
  });

  it('renders custom progress label', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();
    const progressLabel = (solved: number, total: number) => `Completed: ${solved}/${total}`;

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={3}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
        progressLabel={progressLabel}
      />
    );

    expect(screen.getByText('Completed: 3/10')).toBeInTheDocument();
  });

  it('renders scramble button with custom label', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={0}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
        scrambleLabel="Reset Puzzle"
      />
    );

    expect(screen.getByRole('button', { name: /Reset Puzzle/ })).toBeInTheDocument();
  });

  it('calls onScramble when scramble button is clicked', async () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();
    const user = userEvent.setup();

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={0}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
      />
    );

    const scrambleButton = screen.getByRole('button', { name: /Scramble/ });
    await user.click(scrambleButton);

    expect(onScramble).toHaveBeenCalledTimes(1);
  });

  it('renders hint button when provided', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();
    const hintButton = <button>Show Hint</button>;

    render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={0}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
        hintButton={hintButton}
      />
    );

    expect(screen.getByRole('button', { name: 'Show Hint' })).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const onDifficultyChange = jest.fn();
    const onScramble = jest.fn();

    const { container } = render(
      <PuzzleControls
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        onScramble={onScramble}
        solvedCount={0}
        totalPieces={10}
        difficultyOptions={mockDifficultyOptions}
      />
    );

    const controlsDiv = container.firstChild as HTMLElement;
    expect(controlsDiv).toHaveClass('rounded-2xl');
  });
});
