import { useProgressContext } from '../contexts/ProgressContext';
import '../styles/progress-stats.css';

export function ProgressStats() {
  const { progress } = useProgressContext();

  return (
    <div className="progress-stats">
      <div className="stat-item">
        <div className="stat-icon">🎮</div>
        <div className="stat-content">
          <div className="stat-value">{progress.gamesPlayed}</div>
          <div className="stat-label">Games Played</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-value">{progress.gamesCompleted}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <div className="stat-value">{progress.totalScore.toLocaleString()}</div>
          <div className="stat-label">Total Score</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon">🔥</div>
        <div className="stat-content">
          <div className="stat-value">{progress.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {progress.achievements.length > 0 && (
        <div className="stat-item">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{progress.achievements.length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      )}
    </div>
  );
}
