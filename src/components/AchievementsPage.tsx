import { AchievementsPanel } from './AchievementsPanel';

export function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent mb-4">
            Your Achievements
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Track your progress and unlock badges as you learn and play!
          </p>
        </div>

        {/* Achievements Panel */}
        <AchievementsPanel />
      </div>
    </div>
  );
}
