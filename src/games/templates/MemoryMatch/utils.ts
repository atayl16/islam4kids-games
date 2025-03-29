import { MemoryMatchData, MemoryCard } from "./types";
import { GameDifficultySettings } from "./types";
import { WordBankEntry } from "../../../types/WordBank";
import { nanoid } from "nanoid";

// Re-export the type so it can be imported from utils.ts
export type { MemoryMatchData };

export const validateMemoryMatchData = (data: unknown): MemoryMatchData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid game data");
  }

  const d = data as MemoryMatchData;

  // Validate words array
  if (!Array.isArray(d.words) || d.words.length === 0) {
    throw new Error("Game data must include a non-empty words array");
  }

  // Validate difficulty
  const validDifficulties = ["easy", "medium", "hard"];
  if (!validDifficulties.includes(d.difficulty)) {
    throw new Error(`Invalid difficulty. Must be one of: ${validDifficulties.join(", ")}`);
  }

  return d;
};

export const initializeCards = (words: WordBankEntry[], difficulty: string): MemoryCard[] => {
  const settings = getDifficultySettings();
  const difficultyConfig = settings[difficulty as keyof typeof settings];
  let pairsToUse: number;

  // Determine how many word pairs to use based on difficulty
  if (difficulty === "easy") {
    if (words.length < 3) {
      throw new Error("Not enough words to create a game. Minimum required: 3 pairs.");
    }
    // For easy, if we have 3 words, use all of them, otherwise use the standard configuration
    pairsToUse = words.length < difficultyConfig.pairs ? words.length : difficultyConfig.pairs;
  } else if (difficulty === "medium") {
    if (words.length < 3) {
      throw new Error("Not enough words to create a game. Minimum required: 3 pairs.");
    }
    // For medium, if not enough words for standard config, use all available
    pairsToUse = words.length < difficultyConfig.pairs ? words.length : difficultyConfig.pairs;
  } else if (difficulty === "hard") {
    if (words.length < 3) {
      throw new Error("Not enough words to create a game. Minimum required: 3 pairs.");
    }
    // For hard, if not enough words for standard config, use all available
    pairsToUse = words.length < difficultyConfig.pairs ? words.length : difficultyConfig.pairs;
  } else {
    // Default case
    pairsToUse = Math.max(3, Math.min(words.length, 15)); // Default with min/max bounds
  }

  // Ensure minimum number of pairs
  if (pairsToUse < 3) {
    throw new Error("Not enough words. Minimum required: 3 pairs.");
  }

  // Shuffle words first to get random selection
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, pairsToUse); 
  
  const cards = selectedWords.flatMap((word) => [
    { id: `${word.id}-1`, word: { id: word.id, term: word.term, translation: word.translation, arabic: word.arabic }, isFlipped: false, isMatched: false },
    { id: `${word.id}-2`, word: { id: word.id, term: word.term, translation: word.translation, arabic: word.arabic }, isFlipped: false, isMatched: false },
  ]);

  // Shuffle cards using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export const checkMatch = (cards: MemoryCard[], flippedIds: string[]): boolean => {
  if (flippedIds.length !== 2) return false;

  const [firstCard, secondCard] = flippedIds.map((id) =>
    cards.find((card) => card.id === id)
  );

  // Ensure both cards exist before checking for a match
  if (!firstCard || !secondCard) {
    console.warn("One or both cards not found during match check.");
    return false;
  }

  return firstCard.word.id === secondCard.word.id;
};

export const getDifficultySettings = () => ({
  easy: {
    pairs: 4, // 8 cards total (4x2 grid)
    gridColumns: 4,
    gridRows: 2
  },
  medium: {
    pairs: 6, // 12 cards total (4x3 grid)
    gridColumns: 4,
    gridRows: 3
  },
  hard: {
    pairs: 8, // 16 cards total (4x4 grid)
    gridColumns: 4,
    gridRows: 4
  },
});
