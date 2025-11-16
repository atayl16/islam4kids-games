import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordSearch } from './index';
import { WordSearchData } from './types';

// Mock the generateWordSearchGrid utility
jest.mock('./utils', () => ({
  generateWordSearchGrid: jest.fn(),
}));

// Mock progress context
jest.mock('../../../contexts/ProgressContext', () => ({
  useProgressContext: () => ({
    recordGameSession: jest.fn(),
    unlockAchievement: jest.fn(),
    getGameStats: jest.fn(() => ({ highScore: 0, bestTime: null, hasPlayed: false })),
    resetProgress: jest.fn(),
    progress: {
      gamesPlayed: 0,
      gamesCompleted: 0,
      totalScore: 0,
      highScores: {},
      completionTimes: {},
      lastPlayed: '',
      streak: 0,
      achievements: []
    }
  })
}));

import { generateWordSearchGrid } from './utils';
const mockGenerateGrid = generateWordSearchGrid as jest.MockedFunction<typeof generateWordSearchGrid>;

const mockGameData: WordSearchData = {
  title: 'Test Word Search',
  words: [
    { word: 'SALAH', hint: 'Prayer' },
    { word: 'ZAKAT', hint: 'Charity' },
  ],
  grid: [
    ['S', 'A', 'L', 'A', 'H', 'X'],
    ['Z', 'A', 'K', 'A', 'T', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X'],
  ],
  wordPlacements: [
    {
      word: 'SALAH',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 }
      ]
    },
    {
      word: 'ZAKAT',
      positions: [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 1, col: 4 }
      ]
    },
  ],
};

describe('WordSearch Component', () => {
  beforeEach(() => {
    // Mock the grid generation to return our test data
    mockGenerateGrid.mockReturnValue(mockGameData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders game title', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    expect(screen.getByText('Test Word Search')).toBeInTheDocument();
  });

  it('renders the word grid', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    // Check that cells are rendered
    const cells = screen.getAllByRole('button');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('displays word list', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    expect(screen.getByText('SALAH')).toBeInTheDocument();
    expect(screen.getByText('ZAKAT')).toBeInTheDocument();
  });

  it('allows cell selection', async () => {
    const user = userEvent.setup();
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    const cells = screen.getAllByRole('button');
    
    // Click first cell
    await user.click(cells[0]);
    
    // Cell should have Tailwind classes applied
    expect(cells[0]).toHaveClass('flex');
  });

  it('shows hints for words', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    expect(screen.getByText(/Prayer/)).toBeInTheDocument();
    expect(screen.getByText(/Charity/)).toBeInTheDocument();
  });

  it('tracks found words', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);

    // Should show progress
    const progressElements = screen.getAllByText((content, element) => {
      return element?.textContent === '0 / 2 words found';
    });
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('has reset button', () => {
    render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<WordSearch data={mockGameData} category="test" gameSlug="test-slug" />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mx-auto');
  });
});
