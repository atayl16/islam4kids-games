import { render, screen, waitFor, act } from '@testing-library/react';
import { AchievementNotification } from './AchievementNotification';
import { Achievement } from '../types/achievements';

const mockAchievement: Achievement = {
  id: 'test-achievement',
  title: 'Test Master',
  description: 'Complete all tests successfully',
  icon: '🎯',
  category: 'completion',
  condition: () => true,
};

describe('AchievementNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders achievement details correctly', () => {
    const onDismiss = jest.fn();
    render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('Test Master')).toBeInTheDocument();
    expect(
      screen.getByText('Complete all tests successfully')
    ).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('has correct ARIA attributes for accessibility', () => {
    const onDismiss = jest.fn();
    const { container } = render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    const notification = container.querySelector('.achievement-notification');
    expect(notification).toHaveAttribute('role', 'alert');
    expect(notification).toHaveAttribute('aria-live', 'polite');
  });

  it('becomes visible after initial render', async () => {
    const onDismiss = jest.fn();
    const { container } = render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    const notification = container.querySelector('.achievement-notification');

    // Should not be visible initially
    expect(notification).not.toHaveClass('visible');

    // Fast-forward past the fade-in delay
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Should now be visible
    await waitFor(() => {
      expect(notification).toHaveClass('visible');
    });
  });

  it('auto-dismisses after 5 seconds', async () => {
    const onDismiss = jest.fn();
    render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    // Fast-forward through fade in + display time
    act(() => {
      jest.advanceTimersByTime(5100); // 100ms fade in + 5000ms display
    });

    // Should start fading out, not dismissed yet
    await waitFor(() => {
      expect(onDismiss).not.toHaveBeenCalled();
    });

    // Complete the fade-out animation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('displays the achievement icon', () => {
    const onDismiss = jest.fn();
    render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    const icon = screen.getByText('🎯');
    expect(icon).toHaveClass('achievement-icon');
  });

  it('renders with correct structure', () => {
    const onDismiss = jest.fn();
    const { container } = render(
      <AchievementNotification
        achievement={mockAchievement}
        onDismiss={onDismiss}
      />
    );

    expect(container.querySelector('.achievement-notification')).toBeInTheDocument();
    expect(container.querySelector('.achievement-content')).toBeInTheDocument();
    expect(container.querySelector('.achievement-text')).toBeInTheDocument();
    expect(container.querySelector('.achievement-label')).toBeInTheDocument();
    expect(container.querySelector('.achievement-title')).toBeInTheDocument();
    expect(container.querySelector('.achievement-description')).toBeInTheDocument();
  });
});
