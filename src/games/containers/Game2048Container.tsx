import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game2048 } from '../templates/Game2048';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const Game2048Container = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);

  const handleComplete = () => {
    // Record completion in progress tracking
    recordGameCompletion('2048', difficulty, currentScore);
    navigate('/');
  };

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
  };

  return (
    <div>
      <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
      <Game2048
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
