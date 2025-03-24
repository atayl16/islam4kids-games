import { validateWordScrambleData } from "./templates/WordScramble/utils";
import { validateJigsawConfig } from "./templates/JigsawPuzzle/utils";

// Word scramble puzzles registry
export const wordScramblePuzzles = {
  pillars: () => import("./data/wordscramble/pillars.json").then(module => validateWordScrambleData(module.default)),
  ramadan: () => import("./data/wordscramble/ramadan.json").then(module => validateWordScrambleData(module.default)),
  // Add more word scramble puzzles here:
  // prophets: () => import("./data/wordscramble/prophets.json").then(module => validateWordScrambleData(module.default)),
  // prayers: () => import("./data/wordscramble/prayers.json").then(module => validateWordScrambleData(module.default)),
};

// Jigsaw puzzles registry
export const jigsawPuzzles = {
  kaaba: () => import("./data/jigsaw/kaaba.json").then(module => validateJigsawConfig(module.default)),
  // Add more jigsaw puzzles here:
  // masjid: () => import("./data/jigsaw/masjid.json").then(module => validateJigsawConfig(module.default)),
  // mosque: () => import("./data/jigsaw/mosque.json").then(module => validateJigsawConfig(module.default)),
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
