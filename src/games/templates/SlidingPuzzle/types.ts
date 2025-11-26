export interface Tile {
  value: number; // 0 represents the empty tile
  correctPosition: number;
  currentPosition: number;
}

export interface SlidingPuzzleGameState {
  tiles: Tile[];
  emptyIndex: number;
  moves: number;
  isComplete: boolean;
  gridSize: number; // 3x3, 4x4, or 5x5
}

export interface SlidingPuzzleGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  imageSlug: string;
  onComplete: () => void;
  onScoreChange?: (score: number) => void;
}

export const GRID_SIZES = {
  easy: 3,    // 3x3 = 8 tiles + 1 empty
  medium: 4,  // 4x4 = 15 tiles + 1 empty
  hard: 5,    // 5x5 = 24 tiles + 1 empty
};

export const AVAILABLE_IMAGES = [
  'kaaba',
  'mosque',
  'mosque2',
  'mosque3',
  'mosque4',
  'quran',
  'quran2',
  'muslimah',
  'muslimah-bff',
  'read-outside',
  'eid',
];
