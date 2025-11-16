import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlidingPuzzleGame } from '../templates/SlidingPuzzle';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const SlidingPuzzleContainer = () => {
  const { puzzleSlug } = useParams<{ puzzleSlug: string }>();
  const navigate = useNavigate();
  const { recordGameSession } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);
  const [startTime] = useState(Date.now());

  // Use the puzzle slug from URL, or default to 'kaaba'
  const imageSlug = puzzleSlug || 'kaaba';

  const handleComplete = () => {
    // Record completion in progress tracking
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    recordGameSession({
      gameType: 'slidingpuzzle',
      gameSlug: `sliding-puzzle-${imageSlug}`,
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
      <SlidingPuzzleGame
        difficulty={difficulty}
        imageSlug={imageSlug}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
