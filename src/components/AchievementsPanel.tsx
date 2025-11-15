import { useState } from 'react';
import { useProgressContext } from '../contexts/ProgressContext';
import { ACHIEVEMENTS } from '../types/achievements';
import '../styles/achievements-panel.css';

export function AchievementsPanel() {
  const { progress } = useProgressContext();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    progress.achievements.includes(a.id)
  );
  const lockedAchievements = ACHIEVEMENTS.filter(
    (a) => !progress.achievements.includes(a.id)
  );

  const filteredAchievements =
    filter === 'all'
      ? ACHIEVEMENTS
      : filter === 'unlocked'
        ? unlockedAchievements
        : lockedAchievements;

  const progressPercent =
    ACHIEVEMENTS.length === 0
      ? 0
      : Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h2>Achievements</h2>
        <div className="achievements-progress">
          <div className="progress-text">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="achievements-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({ACHIEVEMENTS.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedAchievements.length})
        </button>
        <button
          className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
          onClick={() => setFilter('locked')}
        >
          Locked ({lockedAchievements.length})
        </button>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = progress.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon-large">{achievement.icon}</div>
              <div className="achievement-info">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                {isUnlocked && <div className="unlock-badge">✓ Unlocked</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
