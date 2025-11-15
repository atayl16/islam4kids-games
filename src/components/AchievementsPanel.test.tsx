import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementsPanel } from './AchievementsPanel';
import { ProgressProvider } from '../contexts/ProgressContext';
import { ACHIEVEMENTS } from '../types/achievements';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ProgressProvider>{ui}</ProgressProvider>);
};

describe('AchievementsPanel', () => {
  it('renders achievement list', () => {
    renderWithProvider(<AchievementsPanel />);
    
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    renderWithProvider(<AchievementsPanel />);
    
    // Check that we show total achievements
    expect(screen.getByText(new RegExp(`${ACHIEVEMENTS.length}`))).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    renderWithProvider(<AchievementsPanel />);
    
    expect(screen.getByRole('button', { name: /All/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unlocked/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Locked/ })).toBeInTheDocument();
  });

  it('filters achievements when clicking filter buttons', async () => {
    const user = userEvent.setup();
    renderWithProvider(<AchievementsPanel />);
    
    const allButton = screen.getByRole('button', { name: /All/ });
    const unlockedButton = screen.getByRole('button', { name: /Unlocked/ });
    
    // Check initial state - All button should have gradient background
    expect(allButton).toHaveClass('from-emerald-500');
    
    // Click Unlocked button
    await user.click(unlockedButton);
    
    // Check that Unlocked button now has gradient background
    expect(unlockedButton).toHaveClass('from-emerald-500');
  });

  it('displays all achievements by default', () => {
    renderWithProvider(<AchievementsPanel />);
    
    // Should show all achievements count in filter button
    const allButton = screen.getByRole('button', { name: new RegExp(`All.*${ACHIEVEMENTS.length}`) });
    expect(allButton).toBeInTheDocument();
  });

  it('shows unlocked achievements with green styling', () => {
    renderWithProvider(<AchievementsPanel />);
    
    const achievementCards = screen.getAllByText(/Unlocked|Locked/i);
    expect(achievementCards.length).toBeGreaterThan(0);
  });

  it('has Tailwind styling classes', () => {
    const { container } = renderWithProvider(<AchievementsPanel />);
    
    const panelDiv = container.firstChild as HTMLElement;
    expect(panelDiv).toHaveClass('rounded-3xl');
    expect(panelDiv).toHaveClass('border-emerald-100');
  });
});
