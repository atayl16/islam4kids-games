import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizGame } from './index';
import { QuizQuestion } from './types';

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

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the translation for "Salah"?',
    correctAnswer: 'Prayer',
    options: ['Prayer', 'Charity', 'Fasting', 'Pilgrimage'],
    term: 'Salah',
    translation: 'Prayer',
    hint: 'One of the five pillars of Islam'
  },
  {
    id: '2',
    question: 'What is the translation for "Zakat"?',
    correctAnswer: 'Charity',
    options: ['Prayer', 'Charity', 'Fasting', 'Pilgrimage'],
    term: 'Zakat',
    translation: 'Charity',
    hint: 'Giving to those in need'
  },
  {
    id: '3',
    question: 'What is the translation for "Sawm"?',
    correctAnswer: 'Fasting',
    options: ['Prayer', 'Charity', 'Fasting', 'Pilgrimage'],
    term: 'Sawm',
    translation: 'Fasting',
    hint: 'Observed during Ramadan'
  },
  {
    id: '4',
    question: 'What is the translation for "Hajj"?',
    correctAnswer: 'Pilgrimage',
    options: ['Prayer', 'Charity', 'Fasting', 'Pilgrimage'],
    term: 'Hajj',
    translation: 'Pilgrimage',
    hint: 'Journey to Mecca'
  },
];

describe('QuizGame Component Tests', () => {
  it('renders game interface', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    expect(screen.getByText('Quiz Game')).toBeInTheDocument();
  });

  it('displays question on medium difficulty', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    // Medium difficulty asks for term given translation
    expect(screen.getByText(/What is the term for/)).toBeInTheDocument();
  });

  it('displays answer options', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    // Get all buttons - there should be 4 answer buttons
    const buttons = screen.getAllByRole('button');
    const answerButtons = buttons.filter(btn => 
      ['Salah', 'Zakat', 'Sawm', 'Hajj'].includes(btn.textContent || '')
    );
    expect(answerButtons.length).toBe(4);
  });

  it('provides feedback for correct answers', async () => {
    const user = userEvent.setup();
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    // On medium difficulty, correct answers are terms not translations
    // Get the question to find out what the correct answer is
    const questionText = screen.getByRole('heading', { level: 3 }).textContent;
    
    // Extract the translation from the question
    const translationMatch = questionText?.match(/"(.+)"/);
    const translation = translationMatch ? translationMatch[1] : null;
    
    // Find the corresponding term
    const correctTerm = mockQuestions.find(q => q.translation === translation)?.term;
    
    if (correctTerm) {
      const correctButton = screen.getByRole('button', { name: correctTerm });
      await user.click(correctButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Correct!/)).toBeInTheDocument();
      });
    }
  });

  it('provides feedback for incorrect answers', async () => {
    const user = userEvent.setup();
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    // Get the question to find what the INCORRECT answer is
    const questionText = screen.getByRole('heading', { level: 3 }).textContent;
    const translationMatch = questionText?.match(/"(.+)"/);
    const translation = translationMatch ? translationMatch[1] : null;
    
    // Find an incorrect term
    const incorrectTerm = mockQuestions.find(q => q.translation !== translation)?.term;
    
    if (incorrectTerm) {
      const incorrectButton = screen.getByRole('button', { name: incorrectTerm });
      await user.click(incorrectButton);
      
      await waitFor(() => {
        expect(screen.getByText(/not quite right/i)).toBeInTheDocument();
      });
    }
  });

  it('shows difficulty selector', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
  });

  it('has restart button', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    expect(screen.getByRole('button', { name: /Restart/ })).toBeInTheDocument();
  });

  it('shows question progress', () => {
    render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<QuizGame questions={mockQuestions} gameSlug="test-slug" />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mx-auto');
  });
});
