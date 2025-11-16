export type Player = 1 | 2 | null;
export type Board = Player[][];

export interface Position {
  row: number;
  col: number;
}

export interface ConnectFourGameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  winningCells: Position[];
  isGameOver: boolean;
  moveCount: number;
}

export interface ConnectFourGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  onScoreChange?: (score: number) => void;
}

export const ROWS = 6;
export const COLS = 7;
export const CONNECT = 4;

// AI difficulty settings
export const AI_DEPTH = {
  easy: 1,
  medium: 3,
  hard: 5,
};
