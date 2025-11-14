import { createContext, useContext, ReactNode } from 'react';
import { useProgress, GameProgress, GameSession } from '../hooks/useProgress';

interface ProgressContextType {
  progress: GameProgress;
  recordGameSession: (session: GameSession) => void;
  unlockAchievement: (achievementId: string) => void;
  getGameStats: (gameType: string, gameSlug: string) => {
    highScore: number;
    bestTime: number | null;
    hasPlayed: boolean;
  };
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progressHook = useProgress();

  return (
    <ProgressContext.Provider value={progressHook}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
}
