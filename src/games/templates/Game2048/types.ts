export type Tile = {
  value: number;
  id: string;
  isNew?: boolean;
  isMerged?: boolean;
};

export type Grid = (Tile | null)[][];

export interface Game2048State {
  grid: Grid;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  gridSize: number;
}

export interface Game2048Props {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  onScoreChange?: (score: number) => void;
}

export const GRID_SIZES = {
  easy: 4,    // 4x4 grid (classic)
  medium: 5,  // 5x5 grid
  hard: 6,    // 6x6 grid
};

export const WIN_TILE = 2048;

export type Direction = 'up' | 'down' | 'left' | 'right';
