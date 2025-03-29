import { WordBankEntry } from "../../../types/WordBank";

export type MemoryCard = {
  id: string;
  word: Pick<WordBankEntry, "id" | "term" | "translation" | "arabic">;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameDifficultySettings = {
  pairs: number;
  timeLimit: number;
};

export type MemoryMatchData = {
  words: WordBankEntry[]; // Use WordBankEntry for consistency with the shared word bank
  difficulty: "easy" | "medium" | "hard";
};
