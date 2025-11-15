import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementsPanel } from './AchievementsPanel';
import { ProgressProvider } from '../contexts/ProgressContext';
import { ACHIEVEMENTS } from '../types/achievements';

const renderWithContext = (ui: React.ReactElement) => {
  // Mock localStorage to prevent test pollution
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});

  return render(
    <ProgressProvider>
      {ui}
    </ProgressProvider>
  );
};

describe('AchievementsPanel', () => {
  it('renders achievement list', () => {
    renderWithContext(<AchievementsPanel />);
    
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('shows progress bar with total achievements', () => {
    renderWithContext(<AchievementsPanel />);
    
    // Check that we show unlocked/total pattern
    expect(screen.getByText(/0.*\/ .*20/)).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    renderWithContext(<AchievementsPanel />);
    
    expect(screen.getByRole('button', { name: /All/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unlocked/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Locked/ })).toBeInTheDocument();
  });

  it('filters achievements when clicking filter buttons', async () => {
    const user = userEvent.setup();
    renderWithContext(<AchievementsPanel />);
    
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
    renderWithContext(<AchievementsPanel />);
    
    // Should show all achievements count in filter button
    const allButton = screen.getByRole('button', { name: new RegExp(`All.*${ACHIEVEMENTS.length}`) });
    expect(allButton).toBeInTheDocument();
  });

  it('shows locked achievements with grayscale styling', () => {
    const { container } = renderWithContext(<AchievementsPanel />);
    
    // Check that achievement cards exist by finding elements with grayscale class
    const grayscaleCards = container.querySelectorAll('[class*="grayscale"]');
    expect(grayscaleCards.length).toBeGreaterThan(0);
  });

  it('has Tailwind styling classes', () => {
    const { container } = renderWithContext(<AchievementsPanel />);
    
    const panelDiv = container.firstChild as HTMLElement;
    expect(panelDiv).toHaveClass('rounded-3xl');
    expect(panelDiv).toHaveClass('border-emerald-100');
  });
});
