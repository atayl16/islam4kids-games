import { useState } from 'react';
import { useProgressContext } from '../contexts/ProgressContext';
import { ACHIEVEMENTS } from '../types/achievements';

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
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent mb-4">
          Achievements
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-600">
            <span>{unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All ({ACHIEVEMENTS.length})
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'unlocked'
              ? 'bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedAchievements.length})
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'locked'
              ? 'bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          onClick={() => setFilter('locked')}
        >
          Locked ({lockedAchievements.length})
        </button>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = progress.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`
                rounded-2xl p-4 border-2 transition-all duration-200
                ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-emerald-50 to-violet-50 border-emerald-200 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-emerald-500 to-violet-500'
                    : 'bg-slate-300'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-700 mb-1 truncate">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {achievement.description}
                  </p>
                  {isUnlocked && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
                      <span>✓</span>
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
