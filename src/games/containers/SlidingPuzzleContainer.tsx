import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlidingPuzzleGame } from '../templates/SlidingPuzzle';
import { DifficultySelector } from '../../components/game-common/DifficultySelector';
import { useProgress } from '../../hooks/useProgress';

export const SlidingPuzzleContainer = () => {
  const { puzzleSlug } = useParams<{ puzzleSlug: string }>();
  const navigate = useNavigate();
  const { recordGameCompletion } = useProgress();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentScore, setCurrentScore] = useState(0);

  // Use the puzzle slug from URL, or default to 'kaaba'
  const imageSlug = puzzleSlug || 'kaaba';

  const handleComplete = () => {
    // Record completion in progress tracking
    recordGameCompletion(`sliding-puzzle-${imageSlug}`, difficulty, currentScore);
    navigate('/');
  };

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
  };

  return (
    <div>
      <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
      <SlidingPuzzleGame
        difficulty={difficulty}
        imageSlug={imageSlug}
        onComplete={handleComplete}
        onScoreChange={handleScoreChange}
      />
    </div>
  );
};
