import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementsPanel } from './AchievementsPanel';

// Mock the ProgressContext since it doesn't exist on this branch
const mockProgress = {
  gamesPlayed: 5,
  gamesCompleted: 3,
  totalScore: 1500,
  highScores: {},
  completionTimes: {},
  streak: 2,
  achievements: ['first-win', 'score-100', 'speed-demon'],
};

// Mock the useProgressContext hook
jest.mock('../contexts/ProgressContext', () => ({
  useProgressContext: () => ({
    progress: mockProgress,
  }),
}));

describe('AchievementsPanel', () => {
  it('renders achievements header', () => {
    render(<AchievementsPanel />);
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('displays correct achievement progress', () => {
    render(<AchievementsPanel />);
    // Should show "3 / [total] Unlocked" (we have 3 achievements unlocked in mock)
    expect(screen.getByText(/3 \/ \d+ Unlocked/)).toBeInTheDocument();
  });

  it('renders all filter buttons', () => {
    render(<AchievementsPanel />);
    expect(screen.getByText(/All \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Unlocked \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Locked \(\d+\)/)).toBeInTheDocument();
  });

  it('filters achievements when clicking filter buttons', async () => {
    const user = userEvent.setup();
    render(<AchievementsPanel />);

    const unlockedButton = screen.getByText(/Unlocked \(3\)/);
    await user.click(unlockedButton);

    // Check that the button is now active
    expect(unlockedButton).toHaveClass('active');
  });

  it('shows locked achievements with locked styling', () => {
    render(<AchievementsPanel />);

    const achievementCards = screen
      .getAllByRole('generic')
      .filter((el) => el.className && el.className.includes('achievement-card'));

    // Some cards should have 'locked' class
    const lockedCards = achievementCards.filter((card) =>
      card.className.includes('locked')
    );
    expect(lockedCards.length).toBeGreaterThan(0);
  });

  it('shows unlocked badge for unlocked achievements', () => {
    render(<AchievementsPanel />);

    // Should have 3 "Unlocked" badges
    const unlockedBadges = screen.getAllByText('✓ Unlocked');
    expect(unlockedBadges.length).toBe(3);
  });

  it('displays achievement icons, titles, and descriptions', () => {
    render(<AchievementsPanel />);

    // Should have achievement titles (check for first achievement)
    expect(screen.getByText('First Victory')).toBeInTheDocument();
  });

  it('updates progress bar width based on completion percentage', () => {
    const { container } = render(<AchievementsPanel />);

    const progressFill = container.querySelector('.progress-fill');
    expect(progressFill).toBeInTheDocument();

    // Check that width attribute exists and is a percentage
    const width = progressFill?.getAttribute('style');
    expect(width).toMatch(/width:\s*\d+%/);
  });

  it('renders achievements in a grid layout', () => {
    const { container } = render(<AchievementsPanel />);

    const grid = container.querySelector('.achievements-grid');
    expect(grid).toBeInTheDocument();
  });
});
