import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game2048 } from '../templates/Game2048';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const Game2048Container = () => {
  const navigate = useNavigate();
  const { recordGameSession } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [startTime] = useState(Date.now());

  const handleComplete = () => {
    // Record completion in progress tracking
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    recordGameSession({
      gameType: 'game2048',
      gameSlug: '2048',
      score: currentScore,
      completed: true,
      timeSpent,
      difficulty,
      timestamp: new Date().toISOString(),
    });
    navigate('/');
  };

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy (3x3)' },
    { value: 'medium', label: 'Medium (4x4)' },
    { value: 'hard', label: 'Hard (5x5)' },
  ];

  return (
    <div>
      <DifficultySelector
        currentDifficulty={difficulty}
        onDifficultyChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
        options={difficultyOptions}
      />
      <Game2048
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
