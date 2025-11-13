import { useEffect, useState } from 'react';
import { ACHIEVEMENTS, Achievement, GameStats } from '../types/achievements';

export function useAchievements(stats: GameStats) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    const unlockedAchievements: Achievement[] = [];

    ACHIEVEMENTS.forEach((achievement) => {
      // Check if already unlocked
      if (stats.achievements.includes(achievement.id)) {
        return;
      }

      // Check if condition is met
      if (achievement.condition(stats)) {
        unlockedAchievements.push(achievement);
      }
    });

    if (unlockedAchievements.length > 0) {
      setNewlyUnlocked(unlockedAchievements);
    }
  }, [stats]);

  const clearNewlyUnlocked = () => {
    setNewlyUnlocked([]);
  };

  const getUnlockedAchievements = () => {
    return ACHIEVEMENTS.filter((achievement) =>
      stats.achievements.includes(achievement.id)
    );
  };

  const getLockedAchievements = () => {
    return ACHIEVEMENTS.filter(
      (achievement) => !stats.achievements.includes(achievement.id)
    );
  };

  const getAchievementProgress = () => {
    const total = ACHIEVEMENTS.length;
    const unlocked = stats.achievements.length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
    };
  };

  return {
    newlyUnlocked,
    clearNewlyUnlocked,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementProgress,
  };
}
