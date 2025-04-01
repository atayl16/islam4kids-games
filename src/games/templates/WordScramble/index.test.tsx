import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordScrambleData } from './types';

// Mock the entire react-dnd module and its backends
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()]
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {}
}));

jest.mock('react-dnd-touch-backend', () => ({
  TouchBackend: {}
}));

// Import component after mocks to ensure mocks are used
import { WordScramble } from './index';

// Mock the audio playback
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('WordScramble Component', () => {
  // Sample word scramble data for testing
  const mockData: WordScrambleData = {
    meta: {
      title: 'Islamic Terms',
      instructions: 'Rearrange the letters to form Islamic terms',
      difficulty: 'medium',
      learningObjectives: ['Learn Islamic vocabulary']
    },
    words: [
      {
        solution: 'Allah',
        hint: 'The One God',
        reference: 'Quran 112:1'
      },
      {
        solution: 'Islam',
        hint: 'The religion of peace',
        reference: 'Quran 3:19'
      },
      {
        solution: 'Quran',
        hint: 'The holy book',
        reference: 'Quran 2:2'
      },
      {
        solution: 'Muhammad',
        hint: 'The final prophet',
        reference: 'Quran 33:40'
      }
    ]
  };

  // Mock the navigator.userAgent for device detection
  const originalUserAgent = navigator.userAgent;
  
  beforeAll(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0',
      writable: true
    });
  });
  
  afterAll(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true
    });
  });

  test('renders the word scramble game', () => {
    render(<WordScramble data={mockData} />);
    
    expect(screen.getByText('Islamic Terms')).toBeInTheDocument();
    expect(screen.getByText('Rearrange the letters to form Islamic terms')).toBeInTheDocument();
  });

  test('renders difficulty selector', () => {
    render(<WordScramble data={mockData} />);
    
    // Check that the difficulty dropdown exists
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('shows and hides hint when hint button is clicked', () => {
    render(<WordScramble data={mockData} />);
    
    // Initially, hint is not shown
    expect(screen.queryByText('Hint:')).not.toBeInTheDocument();
    
    // Click show hint button
    fireEvent.click(screen.getByText('Show Hint'));
    
    // Hint should now be visible
    expect(screen.getByText('Hint:')).toBeInTheDocument();
    
    // Click hide hint button
    fireEvent.click(screen.getByText('Hide Hint'));
    
    // Hint should be hidden again
    expect(screen.queryByText('Hint:')).not.toBeInTheDocument();
  });

  test('renders reset button', () => {
    render(<WordScramble data={mockData} />);
    
    // Check that the reset button exists
    expect(screen.getByText('Reset Word')).toBeInTheDocument();
  });

  test('shows loading message when no data is provided', () => {
    render(<WordScramble data={{meta: {title: '', instructions: '', difficulty: 'easy', learningObjectives: []}, words: []}} />);
    
    expect(screen.getByText('Loading word puzzle...')).toBeInTheDocument();
  });
});
