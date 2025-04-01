import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WordSearch } from './index';
import { WordSearchData } from './types';
import * as utils from './utils';

// Mock the audio functionality
jest.mock('../../../components/game-common/CompletionOverlay', () => ({
  __esModule: true,
  default: ({ isVisible, title, message, onPlayAgain }: { 
    isVisible: boolean; 
    title: string; 
    message: string; 
    onPlayAgain: () => void; 
  }) => 
    isVisible ? <div data-testid="completion-overlay">{title} {message}
      <button onClick={onPlayAgain}>Play Again</button>
    </div> : null
}));

// Mock audio playback
window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);

// Mock the generateWordSearchGrid function
jest.spyOn(utils, 'generateWordSearchGrid').mockImplementation((category, difficulty) => {
  // Return a simplified grid based on difficulty
  let gridSize = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
  
  const mockGrid = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill('A'));
  
  // For test predictability, place a known word in the grid
  if (gridSize >= 8) {
    mockGrid[0][0] = 'C';
    mockGrid[0][1] = 'A';
    mockGrid[0][2] = 'T';
  }
  
  return {
    grid: mockGrid,
    title: `${category} Word Search`,
    words: [{word: 'CAT'}, {word: 'DOG'}],
    wordPlacements: [
      {
        word: 'CAT',
        positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}]
      },
      {
        word: 'DOG',
        positions: [{row: 2, col: 2}, {row: 3, col: 2}, {row: 4, col: 2}]
      }
    ],
    meta: {
      instructions: 'Find all the words in the grid!'
    }
  };
});

// Mock data
const mockData: WordSearchData = {
  grid: [
    ['C', 'A', 'T', 'X'],
    ['D', 'O', 'G', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X']
  ],
  title: 'Animals Word Search',
  words: [{word: 'CAT'}, {word: 'DOG'}],
  wordPlacements: [
    {
      word: 'CAT',
      positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}]
    },
    {
      word: 'DOG',
      positions: [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}]
    }
  ],
  meta: {
    instructions: 'Find all the words in the grid!'
  }
};

describe('WordSearch Component', () => {
  test('renders the word search grid with correct title', () => {
    render(<WordSearch data={mockData} category="Animals" />);
    
    expect(screen.getByText('Animals Word Search')).toBeInTheDocument();
    expect(screen.getByText('Find all the words in the grid!')).toBeInTheDocument();
    expect(screen.getByText('Find these words:')).toBeInTheDocument();
    expect(screen.getByText('CAT')).toBeInTheDocument();
    expect(screen.getByText('DOG')).toBeInTheDocument();
  });

  test('allows cell selection and finds words', async () => {
    render(<WordSearch data={mockData} category="Animals" />);
    
    // Select the word CAT horizontally (cells 0,0 to 0,2)
    const startCell = screen.getByText('C');
    const endCell = screen.getByText('T');
    
    fireEvent.click(startCell);
    fireEvent.click(endCell);
    
    // Wait for the word to be marked as found
    await waitFor(() => {
      const wordItems = document.querySelectorAll('.word-item');
      const catItem = Array.from(wordItems).find(item => item.textContent?.includes('CAT'));
      expect(catItem).toHaveClass('found');
    });
  });

  test('changes difficulty regenerates the grid', () => {
    render(<WordSearch data={mockData} category="Animals" />);
    
    // Find and select difficulty option
    const difficultyOptions = screen.getAllByRole('option');
    const hardOption = difficultyOptions.find(option => option.textContent?.includes('Hard'));
    
    if (hardOption) {
      const selectElement = hardOption.closest('select');
      if (selectElement) {
        fireEvent.change(selectElement, { target: { value: 'hard' } });
      }
    }
    
    // Verify that generateWordSearchGrid was called with the new difficulty
    expect(utils.generateWordSearchGrid).toHaveBeenCalledWith('Animals', 'hard');
  });

  test('resets the game when reset button is clicked', async () => {
    render(<WordSearch data={mockData} category="Animals" />);
    
    // Find a word first
    const startCell = screen.getByText('C');
    const endCell = screen.getByText('T');
    fireEvent.click(startCell);
    fireEvent.click(endCell);
    
    // Wait for the word to be marked as found
    await waitFor(() => {
      const wordItems = document.querySelectorAll('.word-item');
      const catItem = Array.from(wordItems).find(item => item.textContent?.includes('CAT'));
      expect(catItem).toHaveClass('found');
    });
    
    // Click reset button
    const resetButton = screen.getByText('Reset Game');
    fireEvent.click(resetButton);
    
    // Verify the game has been reset
    await waitFor(() => {
      const wordItems = document.querySelectorAll('.word-item');
      const catItem = Array.from(wordItems).find(item => item.textContent?.includes('CAT'));
      expect(catItem).not.toHaveClass('found');
    });
  });
});
