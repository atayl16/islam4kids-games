import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PuzzleControls } from './PuzzleControls';

const mockDifficultyOptions = [
  { value: 'easy', label: 'Easy (4 pieces)' },
  { value: 'medium', label: 'Medium (9 pieces)' },
  { value: 'hard', label: 'Hard (16 pieces)' },
];

describe('PuzzleControls', () => {
  const defaultProps = {
    currentDifficulty: 'easy',
    onDifficultyChange: jest.fn(),
    onScramble: jest.fn(),
    solvedCount: 2,
    totalPieces: 4,
    difficultyOptions: mockDifficultyOptions,
  };

  it('renders difficulty selector', () => {
    render(<PuzzleControls {...defaultProps} />);
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
  });

  it('renders scramble button with default label', () => {
    render(<PuzzleControls {...defaultProps} />);
    const scrambleButton = screen.getByRole('button', { name: /scramble pieces/i });
    expect(scrambleButton).toBeInTheDocument();
  });

  it('renders scramble button with custom label', () => {
    render(
      <PuzzleControls {...defaultProps} scrambleLabel="🔀 Mix Up Cards" />
    );
    const scrambleButton = screen.getByRole('button', { name: /mix up cards/i });
    expect(scrambleButton).toBeInTheDocument();
  });

  it('calls onScramble when scramble button is clicked', async () => {
    const onScramble = jest.fn();
    const user = userEvent.setup();

    render(<PuzzleControls {...defaultProps} onScramble={onScramble} />);

    const scrambleButton = screen.getByRole('button', { name: /scramble pieces/i });
    await user.click(scrambleButton);

    expect(onScramble).toHaveBeenCalledTimes(1);
  });

  it('displays progress with default label', () => {
    render(<PuzzleControls {...defaultProps} />);
    expect(screen.getByText('2/4 Completed')).toBeInTheDocument();
  });

  it('displays progress with custom label', () => {
    render(
      <PuzzleControls
        {...defaultProps}
        progressLabel={(solved, total) => `Found ${solved} of ${total} matches`}
      />
    );
    expect(screen.getByText('Found 2 of 4 matches')).toBeInTheDocument();
  });

  it('updates progress display when counts change', () => {
    const { rerender } = render(<PuzzleControls {...defaultProps} />);
    expect(screen.getByText('2/4 Completed')).toBeInTheDocument();

    rerender(<PuzzleControls {...defaultProps} solvedCount={4} />);
    expect(screen.getByText('4/4 Completed')).toBeInTheDocument();
  });

  it('calls onDifficultyChange when difficulty is changed', async () => {
    const onDifficultyChange = jest.fn();
    const user = userEvent.setup();

    render(
      <PuzzleControls
        {...defaultProps}
        onDifficultyChange={onDifficultyChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'hard');

    expect(onDifficultyChange).toHaveBeenCalledWith('hard');
  });

  it('renders hint button when provided', () => {
    const hintButton = (
      <button data-testid="hint-button">Show Hint</button>
    );

    render(<PuzzleControls {...defaultProps} hintButton={hintButton} />);

    expect(screen.getByTestId('hint-button')).toBeInTheDocument();
    expect(screen.getByText('Show Hint')).toBeInTheDocument();
  });

  it('does not render hint button when not provided', () => {
    render(<PuzzleControls {...defaultProps} />);
    expect(screen.queryByTestId('hint-button')).not.toBeInTheDocument();
  });

  it('renders custom children when provided', () => {
    render(
      <PuzzleControls {...defaultProps}>
        <div data-testid="custom-control">Custom Control</div>
      </PuzzleControls>
    );

    expect(screen.getByTestId('custom-control')).toBeInTheDocument();
    expect(screen.getByText('Custom Control')).toBeInTheDocument();
  });

  it('wraps custom children in custom-controls div', () => {
    const { container } = render(
      <PuzzleControls {...defaultProps}>
        <div>Custom Control</div>
      </PuzzleControls>
    );

    expect(container.querySelector('.custom-controls')).toBeInTheDocument();
  });

  it('does not render custom-controls div when no children', () => {
    const { container } = render(<PuzzleControls {...defaultProps} />);
    expect(container.querySelector('.custom-controls')).not.toBeInTheDocument();
  });

  it('has correct CSS structure', () => {
    const { container } = render(<PuzzleControls {...defaultProps} />);

    expect(container.querySelector('.puzzle-controls')).toBeInTheDocument();
    expect(container.querySelector('.difficulty-selector')).toBeInTheDocument();
    expect(container.querySelector('.scramble-button')).toBeInTheDocument();
    expect(container.querySelector('.progress')).toBeInTheDocument();
  });

  it('maintains correct element order', () => {
    const { container } = render(
      <PuzzleControls
        {...defaultProps}
        hintButton={<button>Hint</button>}
      >
        <div>Extra</div>
      </PuzzleControls>
    );

    const controls = container.querySelector('.puzzle-controls');
    const children = controls?.children;

    expect(children).toHaveLength(5); // difficulty, scramble, hint, progress, custom
  });
});
