import { render, screen, act } from '@testing-library/react';
import { AchievementNotification } from './AchievementNotification';
import { Achievement } from '../types/achievements';

const mockAchievement: Achievement = {
  id: 'test-achievement',
  title: 'Test Achievement',
  description: 'This is a test achievement',
  icon: '🎉',
  category: 'milestone',
};

describe('AchievementNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders achievement notification', () => {
    const onDismiss = jest.fn();
    render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);
    
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('This is a test achievement')).toBeInTheDocument();
  });

  it('shows achievement icon', () => {
    const onDismiss = jest.fn();
    render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);
    
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('auto-dismisses after 5 seconds', () => {
    const onDismiss = jest.fn();
    render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);

    act(() => {
      jest.advanceTimersByTime(100); // Fade in
    });

    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000); // Auto dismiss
    });

    act(() => {
      jest.advanceTimersByTime(300); // Fade out animation
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA attributes for accessibility', () => {
    const onDismiss = jest.fn();
    const { container } = render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);
    
    const notification = container.firstChild as HTMLElement;
    expect(notification).toHaveAttribute('role', 'alert');
    expect(notification).toHaveAttribute('aria-live', 'polite');
  });

  it('displays "Achievement Unlocked!" label', () => {
    const onDismiss = jest.fn();
    render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);

    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
  });

  it('has Tailwind styling classes', () => {
    const onDismiss = jest.fn();
    const { container } = render(<AchievementNotification achievement={mockAchievement} onDismiss={onDismiss} />);
    
    const notification = container.firstChild as HTMLElement;
    expect(notification).toHaveClass('fixed');
    expect(notification).toHaveClass('rounded-2xl');
  });
});
