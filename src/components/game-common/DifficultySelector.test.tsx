import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DifficultySelector } from './DifficultySelector';

const mockOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

describe('DifficultySelector', () => {
  it('renders with label and select element', () => {
    const onDifficultyChange = jest.fn();
    render(
      <DifficultySelector
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays all difficulty options', () => {
    const onDifficultyChange = jest.fn();
    render(
      <DifficultySelector
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    expect(screen.getByRole('option', { name: 'Easy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hard' })).toBeInTheDocument();
  });

  it('shows the current difficulty as selected', () => {
    const onDifficultyChange = jest.fn();
    render(
      <DifficultySelector
        currentDifficulty="medium"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('medium');
  });

  it('calls onDifficultyChange when selection changes', async () => {
    const onDifficultyChange = jest.fn();
    const user = userEvent.setup();

    render(
      <DifficultySelector
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'hard');

    expect(onDifficultyChange).toHaveBeenCalledWith('hard');
    expect(onDifficultyChange).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    const onDifficultyChange = jest.fn();
    render(
      <DifficultySelector
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    const select = screen.getByRole('combobox');
    const label = screen.getByText('Difficulty:');

    expect(select).toHaveAttribute('id', 'difficulty-selector');
    expect(label).toHaveAttribute('for', 'difficulty-selector');
  });

  it('renders custom options correctly', async () => {
    const customOptions = [
      { value: 'beginner', label: 'Beginner Level' },
      { value: 'expert', label: 'Expert Level' },
    ];
    const onDifficultyChange = jest.fn();

    render(
      <DifficultySelector
        currentDifficulty="beginner"
        onDifficultyChange={onDifficultyChange}
        options={customOptions}
      />
    );

    expect(screen.getByRole('option', { name: 'Beginner Level' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Expert Level' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Easy' })).not.toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const onDifficultyChange = jest.fn();
    render(
      <DifficultySelector
        currentDifficulty="easy"
        onDifficultyChange={onDifficultyChange}
        options={mockOptions}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('rounded-xl');
    expect(select).toHaveClass('border-emerald-200');
  });
});
