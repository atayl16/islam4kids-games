// Controls for the puzzle (difficulty, scramble button, progress)
import { JIGSAW_DIFFICULTY_PRESETS } from '../constants';

interface PuzzleControlsProps {
  currentDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onScramble: () => void;
  solvedCount: number;
  totalPieces: number;
}

const PuzzleControls = ({
  currentDifficulty,
  onDifficultyChange,
  onScramble,
  solvedCount,
  totalPieces
}: PuzzleControlsProps) => {
  return (
    <div className="puzzle-controls">
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulty: </label>
        <select
          id="difficulty"
          value={currentDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          style={{
            padding: "6px 12px",
            marginRight: "16px",
            borderRadius: "4px",
          }}
        >
          {Object.entries(JIGSAW_DIFFICULTY_PRESETS).map(
            ([key, preset]) => (
              <option key={key} value={key}>
                {preset.label}
              </option>
            )
          )}
        </select>
      </div>

      <button
        onClick={onScramble}
        style={{
          padding: "8px 16px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⟳ Scramble Pieces
      </button>

      <div className="progress">
        {solvedCount}/{totalPieces} Completed
      </div>
    </div>
  );
};

export { PuzzleControls };
export default PuzzleControls;
