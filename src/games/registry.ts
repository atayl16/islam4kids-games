import { validateWordScrambleData } from "./templates/WordScramble/utils";
import { validateJigsawConfig } from "./templates/JigsawPuzzle/utils";

// Helper function to load puzzles with error handling
const loadPuzzle = async (importFn, validator) => {
  try {
    const module = await importFn();
    return validator(module.default);
  } catch (error) {
    console.error("Error loading puzzle:", error);
    throw error;
  }
};

// Word scramble puzzles registry
export const wordScramblePuzzles = {
  pillars: () => loadPuzzle(
    () => import("./data/wordscramble/pillars.json"), 
    validateWordScrambleData
  ),
  ramadan: () => loadPuzzle(
    () => import("./data/wordscramble/ramadan.json"), 
    validateWordScrambleData
  ),
  // Add more word scramble puzzles here:
  // prophets: () => loadPuzzle(() => import("./data/wordscramble/prophets.json"), validateWordScrambleData),
  // prayers: () => loadPuzzle(() => import("./data/wordscramble/prayers.json"), validateWordScrambleData),
};

// Jigsaw puzzles registry
export const jigsawPuzzles = {
  kaaba: () => loadPuzzle(
    () => import("./data/jigsaw/kaaba.json"), 
    validateJigsawConfig
  ),
  // Add more jigsaw puzzles here:
  // masjid: () => loadPuzzle(() => import("./data/jigsaw/masjid.json"), validateJigsawConfig),
  // mosque: () => loadPuzzle(() => import("./data/jigsaw/mosque.json"), validateJigsawConfig),
};

// Get a list of all available puzzles for home page display
export const getAvailablePuzzles = () => {
  const wordScrambleKeys = Object.keys(wordScramblePuzzles);
  const jigsawKeys = Object.keys(jigsawPuzzles);
  
  return {
    wordScramble: wordScrambleKeys,
    jigsaw: jigsawKeys
  };
};
