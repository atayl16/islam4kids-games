import { WordScrambleData } from "./types";

export const validateWordScrambleData = (data: unknown): WordScrambleData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid game data");
  }

  const d = data as WordScrambleData;

  if (!["easy", "medium", "hard"].includes(d.meta.difficulty)) {
    throw new Error(`Invalid difficulty level: ${d.meta.difficulty}`);
  }

  return d;
};
