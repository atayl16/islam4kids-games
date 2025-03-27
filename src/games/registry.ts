import { validateWordScrambleData, WordScrambleData } from "./templates/WordScramble/utils";
import { validateJigsawConfig } from "./templates/JigsawPuzzle/utils";

// Re-export the WordScrambleData type
export type { WordScrambleData };

// Helper function to load puzzles with error handling
const loadPuzzle = async (importFn: () => Promise<{ default: any }>, validator: (data: any) => any) => {
  try {
    const module = await importFn();
    return validator(module.default);
  } catch (error) {
    console.error("Error loading puzzle:", error);
    throw error;
  }
};

// Extract all unique categories from the word bank
const getWordBankCategories = async (): Promise<string[]> => {
  try {
    const wordBank = await import("./data/word-bank/words.json");
    const allCategories = new Set<string>();
    
    wordBank.default.words.forEach(word => {
      word.categories.forEach(category => {
        allCategories.add(category);
      });
    });
    
    return Array.from(allCategories) as string[];
  } catch (error) {
    console.error("Error loading word bank categories:", error);
    return [];
  }
};

// Function to load word bank and filter by category
const loadWordBankByCategory = async (category: string) => {
  try {
    const wordBank = await import("./data/word-bank/words.json");
    const filteredWords = wordBank.default.words.filter(word => 
      word.categories.includes(category)
    );
    
    if (filteredWords.length === 0) {
      throw new Error(`No words found for category: ${category}`);
    }
    
    // Transform to the format expected by WordScramble component
    return validateWordScrambleData({
      meta: {
        title: `${category} Word Scramble`,
        instructions: `Unscramble these ${category} terms by dragging the letters into the correct order.`
      },
      words: filteredWords.map(word => ({
        solution: word.term,
        hint: word.hints[0] || `This is a ${category} term`,
        reference: word.translation
      }))
    });
  } catch (error) {
    console.error(`Error loading words for category ${category}:`, error);
    throw error;
  }
};

// Dynamically build word scramble puzzles from all categories
const buildWordScramblePuzzles = async (): Promise<{ [key: string]: () => Promise<WordScrambleData> }> => {
  const categories = await getWordBankCategories();
  const puzzles: { [key: string]: () => Promise<WordScrambleData> } = {};
  
  categories.forEach(category => {
    // Convert category to kebab-case for URL slugs
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    puzzles[slug] = () => loadWordBankByCategory(category);
  });
  
  return puzzles;
};

// Word scramble puzzles registry - dynamically built
export let wordScramblePuzzles: { [key: string]: () => Promise<WordScrambleData> } = {
  pillars: () => loadWordBankByCategory("Pillars"),
  ramadan: () => loadWordBankByCategory("Ramadan"),
};

// Initialize dynamic puzzles
buildWordScramblePuzzles().then(puzzles => {
  wordScramblePuzzles = puzzles;
});

// Jigsaw puzzles registry - unchanged
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
