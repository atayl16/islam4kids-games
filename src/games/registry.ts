import { validateWordScrambleData, WordScrambleData } from "./templates/WordScramble/utils";
import { validateJigsawConfig } from "./templates/JigsawPuzzle/utils";
import { 
  WordSearchData,
  generateWordSearchGrid 
} from "./templates/WordSearch";
import { JIGSAW_DIFFICULTY_PRESETS } from "./templates/JigsawPuzzle/constants";
import wordBankData from "./data/word-bank/words.json";

// Initialize empty puzzle registries that will be populated dynamically
export let wordScramblePuzzles: { [key: string]: () => Promise<WordScrambleData> } = {};
export let wordSearchPuzzles: { [key: string]: () => Promise<WordSearchData> } = {};
<<<<<<< Updated upstream
=======
export let jigsawPuzzles: { [key: string]: (difficulty?: string) => Promise<any> } = {};
>>>>>>> Stashed changes

// Update getAvailablePuzzles to always return the current puzzles
export const getAvailablePuzzles = () => ({
  wordScramble: Object.keys(wordScramblePuzzles),
  jigsaw: Object.keys(jigsawPuzzles),
  wordSearch: Object.keys(wordSearchPuzzles),
});

// Re-export the WordScrambleData and WordSearchData types
export type { WordScrambleData, WordSearchData };

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

// Helper function to load jigsaw puzzles with difficulty setting
const loadJigsawPuzzle = async (
  importFn: () => Promise<{ default: any }>, 
  validator: (data: any) => any,
  difficulty?: string
) => {
  try {
    // Use the loadPuzzle function to load the basic puzzle data
    const puzzleData = await loadPuzzle(importFn, validator);
    
    // If difficulty is specified and valid, use it
    const selectedDifficulty = 
      (difficulty && Object.keys(JIGSAW_DIFFICULTY_PRESETS).includes(difficulty))
        ? difficulty 
        : (puzzleData.meta?.defaultDifficulty || "medium");
    
    // Get the difficulty configuration
    const difficultyConfig = 
      JIGSAW_DIFFICULTY_PRESETS[selectedDifficulty as keyof typeof JIGSAW_DIFFICULTY_PRESETS] || 
      JIGSAW_DIFFICULTY_PRESETS.medium;
    
    // Merge puzzle data with difficulty settings
    return {
      ...puzzleData,
      meta: {
        ...puzzleData.meta,
        defaultDifficulty: selectedDifficulty
      },
      jigsawConfig: {
        ...puzzleData.jigsawConfig,
        rows: difficultyConfig.rows,
        columns: difficultyConfig.columns
      }
    };
  } catch (error) {
    console.error("Error loading jigsaw puzzle:", error);
    throw error;
  }
};

// Helper function to count words for a given category
const getWordCountForCategory = (category: string): number => {
  return wordBankData.words.filter(word => 
    word.categories.includes(category)
  ).length;
};

// Extract all unique categories from the word bank that have enough words
const getWordBankCategories = (): string[] => {
  try {
    const categoryMap = new Map<string, number>();
    
    // Count words per category
    wordBankData.words.forEach(word => {
      if (word.categories) {
        word.categories.forEach(category => {
          const currentCount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCount + 1);
        });
      }
    });
    
    // Filter categories with enough words (at least 4 for a reasonable puzzle)
    const MIN_WORDS_FOR_PUZZLE = 4;
    const validCategories = Array.from(categoryMap.entries())
      .filter(([category, count]) => {
        return count >= MIN_WORDS_FOR_PUZZLE && category !== "General";
      })
      .map(([category]) => category);
    
    return validCategories;
  } catch (error) {
    console.error("Error processing word bank categories:", error);
    return [];
  }
};

// Function to load word bank and filter by category
const loadWordBankByCategory = async (category: string) => {
  try {
    const filteredWords = wordBankData.words.filter(word => 
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
        hint: word.hints?.[0] || `This is a ${category} term`,
        reference: word.translation
      }))
    });
  } catch (error) {
    console.error(`Error loading words for category ${category}:`, error);
    throw error;
  }
};

// Function to generate word search from category
const loadWordSearchByCategory = async (category: string, difficulty: string = "medium") => {
  try {
    return generateWordSearchGrid(category, difficulty);
  } catch (error) {
    console.error(`Error generating word search for category ${category}:`, error);
    throw error;
  }
};

// Function to convert category name to a URL-friendly slug
const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, "-");
};

<<<<<<< Updated upstream
=======
// Function to convert slug to title case (used for jigsaw puzzles)
const slugToTitle = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Function to initialize all jigsaw puzzles from the files in data/jigsaw directory
const initializeJigsawPuzzles = () => {
  try {
    // Use Node.js fs module to read jigsaw puzzle files
    const jigsawDir = path.join(__dirname, './data/jigsaw');
    const files = fs.readdirSync(jigsawDir);
    
    // Reset jigsaw puzzles
    jigsawPuzzles = {};
    
    files.filter(file => file.endsWith('.json')).forEach(file => {
      // Extract the filename without extension as the puzzle key
      const fileName = file.replace(/\.json$/, '');
      const puzzleKey = fileName.toLowerCase();
      
      // Create a title from the filename
      const puzzleTitle = slugToTitle(puzzleKey);
      
      // Register the puzzle with support for difficulty parameter
      jigsawPuzzles[puzzleKey] = (difficulty?: string) => loadJigsawPuzzle(
        () => import(`./data/jigsaw/${fileName}.json`),
        validateJigsawConfig,
        difficulty
      );
      
      console.log(`Added jigsaw puzzle: ${puzzleTitle} (key: ${puzzleKey})`);
    });
  } catch (error) {
    console.error("Error initializing jigsaw puzzles:", error);
    
    // Fallback to the static definition for environments where require.context isn't available
    jigsawPuzzles = {
      kaaba: (difficulty?: string) => loadJigsawPuzzle(
        () => import("./data/jigsaw/kaaba.json"), 
        validateJigsawConfig,
        difficulty
      ),
      quran: (difficulty?: string) => loadJigsawPuzzle(
        () => import("./data/jigsaw/quran.json"),
        validateJigsawConfig,
        difficulty
      ),
    };
  }
};

>>>>>>> Stashed changes
// Function to initialize all puzzles
const initializePuzzles = () => {
  const validCategories = getWordBankCategories();
  console.log(`Found ${validCategories.length} categories with enough words:`, validCategories);
  
  // Reset puzzles
  wordScramblePuzzles = {};
  wordSearchPuzzles = {};
  
  // Build both puzzle types for each category
  validCategories.forEach(category => {
    const slug = categoryToSlug(category);
    
    // Add word scramble puzzle
    wordScramblePuzzles[slug] = () => loadWordBankByCategory(category);
    
    // Add word search puzzle
    wordSearchPuzzles[slug] = () => loadWordSearchByCategory(category);
    
    console.log(`Added puzzles for category: ${category} (slug: ${slug})`);
  });
  
  // Add general category if it has enough words
  if (getWordCountForCategory("General") >= 5) {
    const generalSlug = categoryToSlug("General");
    wordScramblePuzzles[generalSlug] = () => loadWordBankByCategory("General");
    wordSearchPuzzles[generalSlug] = () => loadWordSearchByCategory("General");
    console.log(`Added puzzles for General category`);
  }
};

// Initialize puzzles immediately
initializePuzzles();

// Add an event handler for rebuilding puzzles
// This can be called after updating the words.json file programmatically
export const rebuildPuzzles = () => {
  initializePuzzles();
  return {
    wordScramble: Object.keys(wordScramblePuzzles),
    wordSearch: Object.keys(wordSearchPuzzles)
  };
};

// Jigsaw puzzles registry - these still need to be defined manually
export const jigsawPuzzles = {
  kaaba: () => loadPuzzle(
    () => import("./data/jigsaw/kaaba.json"), 
    validateJigsawConfig
  ),
  // Add more jigsaw puzzles here:
  // masjid: () => loadPuzzle(() => import("./data/jigsaw/masjid.json"), validateJigsawConfig),
  // mosque: () => loadPuzzle(() => import("./data/jigsaw/mosque.json"), validateJigsawConfig),
};
