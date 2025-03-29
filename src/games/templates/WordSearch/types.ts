// src/templates/WordSearch/types.ts
export interface WordPosition {
  row: number;
  col: number;
}

export interface WordPlacement {
  word: string;
  positions: WordPosition[];
}

export interface WordData {
  word: string;
  hint?: string;
  categories?: string[];
}

export interface WordSearchData {
  title: string;
  grid: string[][];
  words: WordData[];
  wordPlacements: WordPlacement[];
  meta?: {
    title?: string;
    instructions?: string;
    difficulty?: "easy" | "medium" | "hard";
    learningObjectives?: string[];
  };
  categories?: string[];
}
