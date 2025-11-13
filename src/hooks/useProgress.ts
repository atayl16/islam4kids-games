import { useState, useEffect, useCallback } from 'react';

export interface GameProgress {
  gamesPlayed: number;
  gamesCompleted: number;
  totalScore: number;
  highScores: Record<string, number>;
  completionTimes: Record<string, number>; // in seconds
  lastPlayed: string; // ISO date string
  streak: number; // consecutive days played
  achievements: string[];
}

export interface GameSession {
  gameType: string;
  gameSlug: string;
  score: number;
  completed: boolean;
  timeSpent: number; // in seconds
  difficulty?: string;
  timestamp: string;
}

const STORAGE_KEY = 'islam4kids_progress';
const STREAK_KEY = 'islam4kids_streak';

const defaultProgress: GameProgress = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  totalScore: 0,
  highScores: {},
  completionTimes: {},
  lastPlayed: new Date(0).toISOString(), // Unix epoch - indicates never played
  streak: 0,
  achievements: [],
};

function loadProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Validate that parsed data has the expected structure
      if (typeof parsed === 'object' && parsed !== null) {
        // Ensure numeric fields are valid numbers
        const gamesPlayed = typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : defaultProgress.gamesPlayed;
        const gamesCompleted = typeof parsed.gamesCompleted === 'number' ? parsed.gamesCompleted : defaultProgress.gamesCompleted;
        const totalScore = typeof parsed.totalScore === 'number' ? parsed.totalScore : defaultProgress.totalScore;
        const streak = typeof parsed.streak === 'number' ? parsed.streak : defaultProgress.streak;

        // Ensure object fields are valid objects
        const highScores = typeof parsed.highScores === 'object' && parsed.highScores !== null ? parsed.highScores : defaultProgress.highScores;
        const completionTimes = typeof parsed.completionTimes === 'object' && parsed.completionTimes !== null ? parsed.completionTimes : defaultProgress.completionTimes;

        // Ensure array fields are valid arrays
        const achievements = Array.isArray(parsed.achievements) ? parsed.achievements : defaultProgress.achievements;

        // Validate lastPlayed is a valid ISO date string
        let lastPlayed = defaultProgress.lastPlayed;
        if (typeof parsed.lastPlayed === 'string') {
          const date = new Date(parsed.lastPlayed);
          if (!isNaN(date.getTime())) {
            lastPlayed = parsed.lastPlayed;
          }
        }

        return {
          gamesPlayed,
          gamesCompleted,
          totalScore,
          highScores,
          completionTimes,
          lastPlayed,
          streak,
          achievements,
        };
      }
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return defaultProgress;
}

function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // Check if error is due to quota exceeded
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('localStorage quota exceeded. Progress cannot be saved.');
      // Attempt to clear old data and retry
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (retryError) {
        console.error('Failed to save progress even after clearing:', retryError);
      }
    } else {
      console.error('Error saving progress:', error);
    }
  }
}

function calculateStreak(lastPlayed: string): number {
  const now = new Date();
  const last = new Date(lastPlayed);

  // Reset time to midnight for day comparison
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  const storedStreak = localStorage.getItem(STREAK_KEY);
  const currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;

  // Validate parsed streak value
  if (isNaN(currentStreak)) {
    console.warn('Invalid streak value in localStorage, resetting to 1');
    return 1;
  }

  // Same day - maintain current streak
  if (diffDays === 0) {
    return Math.max(currentStreak, 1);
  }

  // Consecutive day - increment streak
  if (diffDays === 1) {
    return currentStreak + 1;
  }

  // Streak broken - reset to 1
  return 1;
}

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recordGameSession = useCallback((session: GameSession) => {
    setProgress((prev) => {
      const gameKey = `${session.gameType}:${session.gameSlug}`;
      const now = new Date().toISOString();

      // Calculate streak
      const newStreak = calculateStreak(prev.lastPlayed);
      localStorage.setItem(STREAK_KEY, newStreak.toString());

      // Update high score if better
      const currentHigh = prev.highScores[gameKey] || 0;
      const newHighScores = session.score > currentHigh
        ? { ...prev.highScores, [gameKey]: session.score }
        : prev.highScores;

      // Update completion time if faster
      const currentTime = prev.completionTimes[gameKey];
      const newCompletionTimes =
        session.completed && (!currentTime || session.timeSpent < currentTime)
          ? { ...prev.completionTimes, [gameKey]: session.timeSpent }
          : prev.completionTimes;

      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesCompleted: session.completed ? prev.gamesCompleted + 1 : prev.gamesCompleted,
        totalScore: prev.totalScore + session.score,
        highScores: newHighScores,
        completionTimes: newCompletionTimes,
        lastPlayed: now,
        streak: newStreak,
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setProgress((prev) => {
      if (prev.achievements.includes(achievementId)) {
        return prev;
      }
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      };
    });
  }, []);

  const getGameStats = useCallback((gameType: string, gameSlug: string) => {
    const gameKey = `${gameType}:${gameSlug}`;
    return {
      highScore: progress.highScores[gameKey] || 0,
      bestTime: progress.completionTimes[gameKey] || null,
      hasPlayed: gameKey in progress.highScores,
    };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STREAK_KEY);
  }, []);

  return {
    progress,
    recordGameSession,
    unlockAchievement,
    getGameStats,
    resetProgress,
  };
}
