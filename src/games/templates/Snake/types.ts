export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {}

export interface SnakeGameState {
  snake: SnakeSegment[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
}

export interface SnakeGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  onScoreChange?: (score: number) => void;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const GAME_SPEEDS = {
  easy: 200,    // 200ms per move
  medium: 150,  // 150ms per move
  hard: 100,    // 100ms per move
};

export const INITIAL_SNAKE: SnakeSegment[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
