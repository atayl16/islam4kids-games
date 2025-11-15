import React, { ReactNode } from "react";
import { DifficultySelector } from "./DifficultySelector";

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
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 border-2 border-emerald-100">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Difficulty Selector */}
        <DifficultySelector
          currentDifficulty={currentDifficulty}
          onDifficultyChange={onDifficultyChange}
          options={difficultyOptions}
        />

        {/* Scramble Button */}
        <button
          onClick={onScramble}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-medium shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {scrambleLabel}
        </button>

        {/* Hint Button (if provided) */}
        {hintButton}

        {/* Progress Display */}
        <div className="px-6 py-2 bg-gradient-to-r from-violet-100 to-emerald-100 rounded-xl">
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
            {progressLabel(solvedCount, totalPieces)}
          </span>
        </div>

        {/* Additional Custom Controls */}
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </div>
  );
};

export { PuzzleControls };
export default PuzzleControls;
