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
  lastPlayed: new Date().toISOString(),
  streak: 0,
  achievements: [],
};

function loadProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultProgress, ...parsed };
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
    console.error('Error saving progress:', error);
  }
}

function calculateStreak(lastPlayed: string): number {
  const now = new Date();
  const last = new Date(lastPlayed);

  // Reset time to midnight for day comparison
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  // If played today or yesterday, maintain streak
  if (diffDays <= 1) {
    const storedStreak = localStorage.getItem(STREAK_KEY);
    return storedStreak ? parseInt(storedStreak, 10) : 1;
  }

  // Streak broken
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
