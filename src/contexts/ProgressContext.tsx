import { createContext, useContext } from 'react';

// Minimal stub for testing purposes
// This will be properly implemented in the progress tracking PR

interface Progress {
  gamesPlayed: number;
  gamesCompleted: number;
  totalScore: number;
  highScores: Record<string, number>;
  completionTimes: Record<string, number>;
  streak: number;
  achievements: string[];
}

interface ProgressContextType {
  progress: Progress;
}

export const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgressContext(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
}
