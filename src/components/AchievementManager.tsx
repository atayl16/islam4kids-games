import { useEffect, useState } from 'react';
import { useProgressContext } from '../contexts/ProgressContext';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementNotification } from './AchievementNotification';
import { Achievement } from '../types/achievements';

export function AchievementManager() {
  const { progress, unlockAchievement } = useProgressContext();
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements(progress);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<Achievement[]>([]);

  // When new achievements are unlocked, add them to the queue
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      // Unlock all achievements in the progress tracker
      newlyUnlocked.forEach(achievement => {
        unlockAchievement(achievement.id);
      });

      // Add to notification queue
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, unlockAchievement, clearNewlyUnlocked]);

  // Display notifications from the queue one at a time
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [currentNotification, notificationQueue]);

  const handleDismiss = () => {
    setCurrentNotification(null);
  };

  return (
    <>
      {currentNotification && (
        <AchievementNotification
          achievement={currentNotification}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
}
