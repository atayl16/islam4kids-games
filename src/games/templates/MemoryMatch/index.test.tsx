import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryMatch } from './index';
import { WordBankEntry } from '../../../types/WordBank';

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

const mockWords: WordBankEntry[] = [
  {
    id: '1',
    term: 'Salah',
    translation: 'Prayer',
    arabic: 'صلاة',
    hints: ['One of the five pillars of Islam'],
    references: [],
    categories: ['pillars'],
    games: {}
  },
  {
    id: '2',
    term: 'Zakat',
    translation: 'Charity',
    arabic: 'زكاة',
    hints: ['Giving to those in need'],
    references: [],
    categories: ['pillars'],
    games: {}
  },
  {
    id: '3',
    term: 'Sawm',
    translation: 'Fasting',
    arabic: 'صوم',
    hints: ['Observed during Ramadan'],
    references: [],
    categories: ['pillars'],
    games: {}
  },
  {
    id: '4',
    term: 'Hajj',
    translation: 'Pilgrimage',
    arabic: 'حج',
    hints: ['Journey to Mecca'],
    references: [],
    categories: ['pillars'],
    games: {}
  },
];

describe('MemoryMatch Component', () => {
  it('renders the game interface', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(screen.getByText('Memory Match')).toBeInTheDocument();
    expect(screen.getByText(/Match all the cards/i)).toBeInTheDocument();
  });

  it('creates pairs of cards for each word', () => {
    render(<MemoryMatch words={mockWords} />);
    
    // Each word should have 2 cards (pairs)
    const cards = screen.getAllByTestId('memory-card');
    expect(cards.length).toBe(mockWords.length * 2);
  });

  it('flips card on click', async () => {
    const user = userEvent.setup();
    render(<MemoryMatch words={mockWords} />);
    
    const cards = screen.getAllByTestId('memory-card');
    const firstCard = cards[0];
    
    await user.click(firstCard);
    
    // Card should have transform style applied (rotateY)
    expect(firstCard.querySelector('[class*="transform"]')).toBeTruthy();
  });

  it('allows selecting two cards', async () => {
    const user = userEvent.setup();
    render(<MemoryMatch words={mockWords} />);
    
    const cards = screen.getAllByTestId('memory-card');
    
    await user.click(cards[0]);
    await user.click(cards[1]);
    
    // Both cards should be interacted with
    expect(cards[0].querySelector('[class*="transform"]')).toBeTruthy();
    expect(cards[1].querySelector('[class*="transform"]')).toBeTruthy();
  });

  it('tracks move count', async () => {
    const user = userEvent.setup();
    render(<MemoryMatch words={mockWords} />);

    const cards = screen.getAllByTestId('memory-card');

    // Initially 0 moves - text and number are in separate elements
    expect(screen.getByText('Moves:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    // Click two cards
    await user.click(cards[0]);
    await user.click(cards[1]);

    // Should register a move
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('displays difficulty selector', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has reset game button', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(screen.getByRole('button', { name: /Reset Game/ })).toBeInTheDocument();
  });

  it('displays hint button', () => {
    render(<MemoryMatch words={mockWords} />);
    
    expect(screen.getByRole('button', { name: /Show Hint/ })).toBeInTheDocument();
  });

  it('shows hint when hint button is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryMatch words={mockWords} />);
    
    const hintButton = screen.getByRole('button', { name: /Show Hint/ });
    await user.click(hintButton);
    
    expect(screen.getByText(/Try to remember the positions/i)).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<MemoryMatch words={mockWords} />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mx-auto');
  });
});
