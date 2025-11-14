import { renderHook } from '@testing-library/react';
import { useAchievements } from './useAchievements';
import { GameStats } from '../types/achievements';

describe('useAchievements', () => {
  const baseStats: GameStats = {
    gamesPlayed: 0,
    gamesCompleted: 0,
    totalScore: 0,
    highScores: {},
    completionTimes: {},
    streak: 0,
    achievements: [],
  };

  it('returns empty array when no achievements are unlocked', () => {
    const { result } = renderHook(() => useAchievements(baseStats));

    expect(result.current.newlyUnlocked).toEqual([]);
  });

  it('detects newly unlocked achievements', () => {
    const statsWithProgress: GameStats = {
      ...baseStats,
      gamesCompleted: 1,
    };

    const { result } = renderHook(() => useAchievements(statsWithProgress));

    // Should have unlocked "First Victory" achievement
    expect(result.current.newlyUnlocked.length).toBeGreaterThan(0);
    expect(result.current.newlyUnlocked[0].id).toBe('first-win');
  });

  it('does not re-unlock already unlocked achievements', () => {
    const statsWithAchievement: GameStats = {
      ...baseStats,
      gamesCompleted: 1,
      achievements: ['first-win'], // Already unlocked
    };

    const { result } = renderHook(() => useAchievements(statsWithAchievement));

    expect(result.current.newlyUnlocked).toEqual([]);
  });

  it('unlocks score-based achievements', () => {
    const statsWithScore: GameStats = {
      ...baseStats,
      totalScore: 100,
    };

    const { result } = renderHook(() => useAchievements(statsWithScore));

    const scoreAchievement = result.current.newlyUnlocked.find(
      (a) => a.id === 'score-100'
    );
    expect(scoreAchievement).toBeDefined();
  });

  it('unlocks completion-based achievements', () => {
    const statsWithCompletions: GameStats = {
      ...baseStats,
      gamesCompleted: 5,
    };

    const { result } = renderHook(() => useAchievements(statsWithCompletions));

    const fiveGamesAchievement = result.current.newlyUnlocked.find(
      (a) => a.id === 'five-wins'
    );
    expect(fiveGamesAchievement).toBeDefined();
  });

  it('unlocks streak-based achievements', () => {
    const statsWithStreak: GameStats = {
      ...baseStats,
      streak: 3,
    };

    const { result } = renderHook(() => useAchievements(statsWithStreak));

    const streakAchievement = result.current.newlyUnlocked.find(
      (a) => a.id === 'streak-3'
    );
    expect(streakAchievement).toBeDefined();
  });

  it('provides clearNewlyUnlocked function', () => {
    const statsWithProgress: GameStats = {
      ...baseStats,
      gamesCompleted: 1,
    };

    const { result } = renderHook(() => useAchievements(statsWithProgress));

    expect(result.current.clearNewlyUnlocked).toBeInstanceOf(Function);
  });

  it('getUnlockedAchievements returns correct achievements', () => {
    const statsWithAchievements: GameStats = {
      ...baseStats,
      achievements: ['first-win', 'score-100'],
    };

    const { result } = renderHook(() => useAchievements(statsWithAchievements));

    const unlocked = result.current.getUnlockedAchievements();
    expect(unlocked).toHaveLength(2);
    expect(unlocked.map((a) => a.id)).toEqual(['first-win', 'score-100']);
  });

  it('getLockedAchievements returns achievements not yet unlocked', () => {
    const statsWithSomeAchievements: GameStats = {
      ...baseStats,
      achievements: ['first-win'],
    };

    const { result } = renderHook(() =>
      useAchievements(statsWithSomeAchievements)
    );

    const locked = result.current.getLockedAchievements();
    expect(locked.length).toBeGreaterThan(0);
    expect(locked.every((a) => a.id !== 'first-win')).toBe(true);
  });

  it('getAchievementProgress returns correct statistics', () => {
    const statsWithAchievements: GameStats = {
      ...baseStats,
      achievements: ['first-win', 'score-100', 'five-games'],
    };

    const { result } = renderHook(() => useAchievements(statsWithAchievements));

    const progress = result.current.getAchievementProgress();
    expect(progress.unlocked).toBe(3);
    expect(progress.total).toBeGreaterThan(3);
    expect(progress.percentage).toBeGreaterThanOrEqual(0);
    expect(progress.percentage).toBeLessThanOrEqual(100);
  });

  it('updates when stats change', () => {
    const { result, rerender } = renderHook(
      ({ stats }) => useAchievements(stats),
      {
        initialProps: { stats: baseStats },
      }
    );

    expect(result.current.newlyUnlocked).toEqual([]);

    // Update stats to trigger achievement
    const newStats: GameStats = {
      ...baseStats,
      gamesCompleted: 1,
    };

    rerender({ stats: newStats });

    expect(result.current.newlyUnlocked.length).toBeGreaterThan(0);
  });
});
