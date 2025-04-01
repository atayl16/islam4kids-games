import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryMatch } from './index';
import { WordBankEntry } from '../../../types/WordBank';
import { initializeCards } from './utils';

// Mock the utils module to control card initialization
jest.mock('./utils', () => ({
  initializeCards: jest.fn()
}));

// Mock the audio playback for CompletionOverlay
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('MemoryMatch Component', () => {
  // Sample word bank for testing
  const mockWords: WordBankEntry[] = [
    { 
      id: '1', 
      term: 'Allah', 
      translation: 'God', 
      arabic: 'الله',
      hints: ['The One God'],
      references: ['Quran 112:1'],
      categories: ['belief'],
      games: {}
    },
    { 
      id: '2', 
      term: 'Rasul', 
      translation: 'Messenger', 
      arabic: 'رسول',
      hints: ['Prophet Muhammad'],
      references: ['Quran 33:40'],
      categories: ['belief'],
      games: {}
    },
    { 
      id: '3', 
      term: 'Salah', 
      translation: 'Prayer', 
      arabic: 'صلاة',
      hints: ['Five times a day'],
      references: ['Quran 2:43'],
      categories: ['practice'],
      games: {}
    },
    { 
      id: '4', 
      term: 'Zakat', 
      translation: 'Charity', 
      arabic: 'زكاة',
      hints: ['Giving to those in need'],
      references: ['Quran 2:43'],
      categories: ['practice'],
      games: {}
    }
  ];

  // Mock cards that will be returned by initializeCards
  const mockCards = [
    { id: '1a', word: mockWords[0], isFlipped: false, isMatched: false },
    { id: '1b', word: mockWords[0], isFlipped: false, isMatched: false },
    { id: '2a', word: mockWords[1], isFlipped: false, isMatched: false },
    { id: '2b', word: mockWords[1], isFlipped: false, isMatched: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (initializeCards as jest.Mock).mockReturnValue(mockCards);
  });

  test('renders the memory match game', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(screen.getByText('Memory Match')).toBeInTheDocument();
    expect(screen.getByText('Match all the cards to complete the game. Select a difficulty to start.')).toBeInTheDocument();
  });

  test('initializes cards based on difficulty', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(initializeCards).toHaveBeenCalledWith(mockWords, 'easy');
    
    // Change difficulty to medium
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'medium' } });
    
    expect(initializeCards).toHaveBeenCalledWith(mockWords, 'medium');
  });

  test('flips card on click', () => {
    render(<MemoryMatch words={mockWords} />);
    
    const cards = screen.getAllByTestId('memory-card');
    fireEvent.click(cards[0]);
    
    // The first card should be flipped
    expect(cards[0].className).toContain('flipped');
  });

  test('shows error when not enough words are provided', () => {
    (initializeCards as jest.Mock).mockImplementation(() => {
      throw new Error('Not enough words');
    });
    
    render(<MemoryMatch words={[]} />);
    
    expect(screen.getByText(/Couldn't create a game/)).toBeInTheDocument();
  });

  test('toggles hint display when hint button is clicked', () => {
    render(<MemoryMatch words={mockWords} />);
    
    // Initially, hint is not shown
    expect(screen.queryByText('Hint:')).not.toBeInTheDocument();
    
    // Click show hint button
    fireEvent.click(screen.getByText('Show Hint'));
    
    // Hint should now be visible
    expect(screen.getByText('Hint:')).toBeInTheDocument();
    expect(screen.getByText('Try to remember the positions of the cards!')).toBeInTheDocument();
    
    // Click hide hint button
    fireEvent.click(screen.getByText('Hide Hint'));
    
    // Hint should be hidden again
    expect(screen.queryByText('Hint:')).not.toBeInTheDocument();
  });

  test('resets game when reset button is clicked', () => {
    render(<MemoryMatch words={mockWords} />);
    
    fireEvent.click(screen.getByText('Reset Game'));
    
    // initializeCards should be called again
    expect(initializeCards).toHaveBeenCalledTimes(2);
  });

  // This test requires more complex setup to simulate matched cards
  test('shows completion overlay when all cards are matched', async () => {
    // Mock all cards as matched
    const allMatchedCards = mockCards.map(card => ({...card, isMatched: true}));
    (initializeCards as jest.Mock).mockReturnValue(allMatchedCards);
    
    render(<MemoryMatch words={mockWords} />);
    
    // Wait for the completion overlay to appear
    await waitFor(() => {
      expect(screen.getByText(/Mashallah! Great Memory!/)).toBeInTheDocument();
    });
  });
});
