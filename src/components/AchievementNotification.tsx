import { useEffect, useState } from 'react';
import { Achievement } from '../types/achievements';
import '../styles/achievement-notification.css';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setVisible(true), 100);

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`achievement-notification ${visible ? 'visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="achievement-content">
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-text">
          <div className="achievement-label">Achievement Unlocked!</div>
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-description">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
}
