import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectFourGame } from '../templates/ConnectFour';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const ConnectFourGameContainer = () => {
  const navigate = useNavigate();
  const { recordGameSession } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [startTime] = useState(Date.now());

  const handleComplete = () => {
    // Record completion in progress tracking
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    recordGameSession({
      gameType: 'connectfour',
      gameSlug: 'connect-four',
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
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <div>
      <DifficultySelector
        currentDifficulty={difficulty}
        onDifficultyChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
        options={difficultyOptions}
      />
      <ConnectFourGame
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
