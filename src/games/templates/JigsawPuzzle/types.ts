export interface JigsawConfig {
  meta: {
    title: string;
    defaultDifficulty?: string; // Changed from difficulty to defaultDifficulty and made optional
    learningObjectives?: string[]; // Made optional
    imageAlt?: string; // Made optional
  };
  jigsawConfig: {
    imageSrc: string;
    rows?: number; // Made optional as it can come from difficulty presets
    columns?: number; // Made optional as it can come from difficulty presets
  };
}

// Define piece type
export interface PieceState {
  id: number;
  x: number;
  y: number;
  solved: boolean;
}

// Board position type
export interface BoardPosition {
  top: number;
  left: number;
}

// Difficulty preset type
export interface DifficultyPreset {
  rows: number;
  columns: number;
  totalPieces: number;
  label: string;
}

