import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SnakeGame } from '../templates/Snake';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const SnakeGameContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const { recordGameCompletion } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);

  const handleComplete = () => {
    // Record completion in progress tracking
    if (gameSlug) {
      recordGameCompletion(gameSlug, difficulty, currentScore);
    }
    navigate('/');
  };

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
  };

  return (
    <div>
      <DifficultySelector
        difficulty={difficulty}
        onChange={setDifficulty}
      />
      <SnakeGame
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
