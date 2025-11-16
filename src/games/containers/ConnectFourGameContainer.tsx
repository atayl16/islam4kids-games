import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectFourGame } from '../templates/ConnectFour';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const ConnectFourGameContainer = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);

  const handleComplete = () => {
    // Record completion in progress tracking
    recordGameCompletion('connect-four', difficulty, currentScore);
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
      <ConnectFourGame
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
