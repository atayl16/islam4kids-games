import { WordScrambleData } from "./types";

// Re-export the type so it can be imported from utils.ts
export type { WordScrambleData };

export const validateWordScrambleData = (data: unknown): WordScrambleData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid game data");
  }

  const d = data as WordScrambleData;

  // Remove difficulty validation requirement
  // Make sure words array exists
  if (!Array.isArray(d.words) || d.words.length === 0) {
    throw new Error("Game data must include words array");
  }

  return d;
};
