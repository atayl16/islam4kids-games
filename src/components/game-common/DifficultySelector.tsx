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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label
        htmlFor="difficulty-selector"
        className="text-sm font-medium text-slate-700"
      >
        Difficulty:
      </label>
      <select
        id="difficulty-selector"
        value={currentDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value)}
        className="px-4 py-2 bg-white border-2 border-emerald-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 cursor-pointer hover:border-emerald-300"
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
