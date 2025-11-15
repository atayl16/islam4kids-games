import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizGame } from './index';
import { QuizQuestion } from './types';

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
    term: 'Salah',
    translation: 'Prayer',
    hint: 'One of the five pillars',
    question: 'What is the translation for "Salah"?',
    correctAnswer: 'Prayer',
    options: ['Prayer', 'Fasting', 'Charity', 'Pilgrimage'],
  },
  {
    id: '2',
    term: 'Zakat',
    translation: 'Charity',
    hint: 'Giving to the poor',
    question: 'What is the translation for "Zakat"?',
    correctAnswer: 'Charity',
    options: ['Prayer', 'Fasting', 'Charity', 'Pilgrimage'],
  },
];

describe('QuizGame Component Tests', () => {
  it('renders game interface', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText('Quiz Game')).toBeInTheDocument();
  });

  it('displays question', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText(/What is the translation/)).toBeInTheDocument();
  });

  it('displays answer options', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByRole('button', { name: 'Prayer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fasting' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Charity' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pilgrimage' })).toBeInTheDocument();
  });

  it('provides feedback for correct answers', async () => {
    const user = userEvent.setup();
    render(<QuizGame questions={mockQuestions} />);
    
    const correctButton = screen.getByRole('button', { name: 'Prayer' });
    await user.click(correctButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });
  });

  it('provides feedback for incorrect answers', async () => {
    const user = userEvent.setup();
    render(<QuizGame questions={mockQuestions} />);
    
    const incorrectButton = screen.getByRole('button', { name: 'Fasting' });
    await user.click(incorrectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/not quite right/i)).toBeInTheDocument();
    });
  });

  it('shows difficulty selector', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
  });

  it('has restart button', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByRole('button', { name: /Restart/ })).toBeInTheDocument();
  });

  it('shows question progress', () => {
    render(<QuizGame questions={mockQuestions} />);
    
    expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const { container } = render(<QuizGame questions={mockQuestions} />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mx-auto');
  });
});
