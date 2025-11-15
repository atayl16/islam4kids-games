import { useEffect, useState } from 'react';
import { Achievement } from '../types/achievements';

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
      className={`
        fixed top-4 right-4 z-50
        max-w-sm
        bg-white rounded-2xl shadow-2xl border-2 border-emerald-200
        transform transition-all duration-300
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Decorative gradient top */}
      <div className="h-2 rounded-t-2xl bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500"></div>

      <div className="flex items-start gap-4 p-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-2xl shadow-lg">
          {achievement.icon}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
            Achievement Unlocked!
          </div>
          <div className="text-lg font-bold text-slate-700 mb-1 truncate">
            {achievement.title}
          </div>
          <div className="text-sm text-slate-600 line-clamp-2">
            {achievement.description}
          </div>
        </div>
      </div>
    </div>
  );
}
