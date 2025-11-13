export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  category: 'completion' | 'score' | 'speed' | 'streak' | 'mastery';
}

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalScore: number;
  highScores: Record<string, number>;
  completionTimes: Record<string, number>;
  streak: number;
  achievements: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  // Completion Achievements
  {
    id: 'first-win',
    title: 'First Victory',
    description: 'Complete your first game',
    icon: '🎉',
    category: 'completion',
    condition: (stats) => stats.gamesCompleted >= 1,
  },
  {
    id: 'five-wins',
    title: 'Getting Started',
    description: 'Complete 5 games',
    icon: '⭐',
    category: 'completion',
    condition: (stats) => stats.gamesCompleted >= 5,
  },
  {
    id: 'ten-wins',
    title: 'Dedicated Learner',
    description: 'Complete 10 games',
    icon: '🌟',
    category: 'completion',
    condition: (stats) => stats.gamesCompleted >= 10,
  },
  {
    id: 'twenty-wins',
    title: 'Knowledge Seeker',
    description: 'Complete 20 games',
    icon: '✨',
    category: 'completion',
    condition: (stats) => stats.gamesCompleted >= 20,
  },
  {
    id: 'fifty-wins',
    title: 'Master Scholar',
    description: 'Complete 50 games',
    icon: '🏆',
    category: 'completion',
    condition: (stats) => stats.gamesCompleted >= 50,
  },

  // Score Achievements
  {
    id: 'score-100',
    title: 'Century Club',
    description: 'Earn 100 total points',
    icon: '💯',
    category: 'score',
    condition: (stats) => stats.totalScore >= 100,
  },
  {
    id: 'score-500',
    title: 'Point Master',
    description: 'Earn 500 total points',
    icon: '🎯',
    category: 'score',
    condition: (stats) => stats.totalScore >= 500,
  },
  {
    id: 'score-1000',
    title: 'Score Legend',
    description: 'Earn 1000 total points',
    icon: '👑',
    category: 'score',
    condition: (stats) => stats.totalScore >= 1000,
  },
  {
    id: 'perfect-score',
    title: 'Perfection',
    description: 'Achieve a perfect score in any game',
    icon: '💎',
    category: 'score',
    condition: (stats) => Object.values(stats.highScores).some(score => score === 100),
  },

  // Streak Achievements
  {
    id: 'streak-3',
    title: 'Three Day Streak',
    description: 'Play games for 3 days in a row',
    icon: '🔥',
    category: 'streak',
    condition: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Play games for 7 days in a row',
    icon: '🔥🔥',
    category: 'streak',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'streak-14',
    title: 'Two Week Champion',
    description: 'Play games for 14 days in a row',
    icon: '🔥🔥🔥',
    category: 'streak',
    condition: (stats) => stats.streak >= 14,
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Play games for 30 days in a row',
    icon: '🚀',
    category: 'streak',
    condition: (stats) => stats.streak >= 30,
  },

  // Speed Achievements
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete any game in under 60 seconds',
    icon: '⚡',
    category: 'speed',
    condition: (stats) => Object.values(stats.completionTimes).some(time => time < 60),
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Complete any game in under 30 seconds',
    icon: '⚡⚡',
    category: 'speed',
    condition: (stats) => Object.values(stats.completionTimes).some(time => time < 30),
  },

  // Mastery Achievements
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 5 quiz games',
    icon: '📚',
    category: 'mastery',
    condition: (stats) => {
      const quizScores = Object.keys(stats.highScores).filter(key => key.startsWith('quizGame'));
      return quizScores.length >= 5;
    },
  },
  {
    id: 'puzzle-expert',
    title: 'Puzzle Expert',
    description: 'Complete 5 jigsaw puzzles',
    icon: '🧩',
    category: 'mastery',
    condition: (stats) => {
      const jigsawScores = Object.keys(stats.highScores).filter(key => key.startsWith('jigsaw'));
      return jigsawScores.length >= 5;
    },
  },
  {
    id: 'word-wizard',
    title: 'Word Wizard',
    description: 'Complete 5 word games (scramble or search)',
    icon: '✍️',
    category: 'mastery',
    condition: (stats) => {
      const wordScores = Object.keys(stats.highScores).filter(
        key => key.startsWith('wordScramble') || key.startsWith('wordSearch')
      );
      return wordScores.length >= 5;
    },
  },
  {
    id: 'memory-champion',
    title: 'Memory Champion',
    description: 'Complete 5 memory match games',
    icon: '🧠',
    category: 'mastery',
    condition: (stats) => {
      const memoryScores = Object.keys(stats.highScores).filter(key => key.startsWith('memoryMatch'));
      return memoryScores.length >= 5;
    },
  },
  {
    id: 'all-rounder',
    title: 'All-Rounder',
    description: 'Play all 5 different game types',
    icon: '🌈',
    category: 'mastery',
    condition: (stats) => {
      const gameTypes = new Set(
        Object.keys(stats.highScores).map(key => key.split(':')[0])
      );
      return gameTypes.size >= 5;
    },
  },
];
