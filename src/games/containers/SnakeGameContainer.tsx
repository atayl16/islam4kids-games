import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SnakeGame } from '../templates/Snake';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const SnakeGameContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const { recordGameSession } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [startTime] = useState(Date.now());

  const handleComplete = () => {
    // Record completion in progress tracking
    if (gameSlug) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
      recordGameSession({
        gameType: 'snake',
        gameSlug: gameSlug,
        score: currentScore,
        completed: true,
        timeSpent,
        difficulty,
        timestamp: new Date().toISOString(),
      });
    }
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
      <SnakeGame
        difficulty={difficulty}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
