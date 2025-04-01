import React from "react";

type DifficultyOption = {
  value: string;
  label: string;
};

type DifficultySelectorProps = {
  currentDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  options: DifficultyOption[];
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
  options,
}) => {
  return (
    <div className="difficulty-selector">
      <label htmlFor="difficulty-selector" className="difficulty-label">
        Select Difficulty:
      </label>
      <select
        id="difficulty-selector"
        value={currentDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value)}
        className="difficulty-dropdown"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
