import React, { ReactNode } from "react";
import { DifficultySelector } from "./DifficultySelector";
import "../../styles/shared.css"; // Import shared styles

interface PuzzleControlsProps {
  currentDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onScramble: () => void;
  solvedCount: number;
  totalPieces: number;
  difficultyOptions: { value: string; label: string }[];
  scrambleLabel?: string; // Optional label for the scramble button
  progressLabel?: (solved: number, total: number) => string; // Optional custom progress label
  hintButton?: ReactNode; // Optional hint button for games like Memory Match
  children?: ReactNode; // Additional custom controls
}

const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  currentDifficulty,
  onDifficultyChange,
  onScramble,
  solvedCount,
  totalPieces,
  difficultyOptions,
  scrambleLabel = "⟳ Scramble Pieces",
  progressLabel = (solved, total) => `${solved}/${total} Completed`,
  hintButton,
  children,
}) => {
  return (
    <div className="puzzle-controls">
      {/* Difficulty Selector */}
      <div className="difficulty-selector">
        <DifficultySelector
          currentDifficulty={currentDifficulty}
          onDifficultyChange={onDifficultyChange}
          options={difficultyOptions}
        />
      </div>

      {/* Scramble Button */}
      <button
        onClick={onScramble}
        className="scramble-button"
      >
        {scrambleLabel}
      </button>

      {/* Hint Button (if provided) */}
      {hintButton}

      {/* Progress Display */}
      <div className="progress">
        {progressLabel(solvedCount, totalPieces)}
      </div>

      {/* Additional Custom Controls */}
      {children && <div className="custom-controls">{children}</div>}
    </div>
  );
};

export { PuzzleControls };
export default PuzzleControls;
