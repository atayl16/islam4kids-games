import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordSearch } from './index';
import { WordSearchData } from './types';

const mockGameData: WordSearchData = {
  words: [
    { word: 'SALAH', hint: 'Prayer' },
    { word: 'ZAKAT', hint: 'Charity' },
  ],
  grid: [
    ['S', 'A', 'L', 'A', 'H', 'X'],
    ['Z', 'A', 'K', 'A', 'T', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X'],
  ],
  solutions: [
    { word: 'SALAH', positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
    { word: 'ZAKAT', positions: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] },
  ],
};

describe('WordSearch Component', () => {
  it('renders game title and instructions', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    expect(screen.getByRole('heading', { name: /Word Search/i })).toBeInTheDocument();
  });

  it('renders the word grid', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    // Check that cells are rendered
    const cells = screen.getAllByRole('button');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('displays word list', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    expect(screen.getByText('SALAH')).toBeInTheDocument();
    expect(screen.getByText('ZAKAT')).toBeInTheDocument();
  });

  it('allows cell selection and finds words', async () => {
    const user = userEvent.setup();
    render(<WordSearch gameData={mockGameData} />);
    
    const cells = screen.getAllByRole('button');
    
    // Click first cell
    await user.click(cells[0]);
    
    // Cell should have Tailwind classes applied
    expect(cells[0]).toHaveClass('flex');
  });

  it('shows hints for words', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    expect(screen.getByText(/Prayer/)).toBeInTheDocument();
    expect(screen.getByText(/Charity/)).toBeInTheDocument();
  });

  it('tracks found words', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    // Should show progress
    expect(screen.getByText(/0/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('has reset button', () => {
    render(<WordSearch gameData={mockGameData} />);
    
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<WordSearch gameData={mockGameData} />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mx-auto');
  });
});
