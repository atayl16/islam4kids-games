import { validateWordScrambleData, WordScrambleData } from "./templates/WordScramble/utils";
import { validateJigsawConfig } from "./templates/JigsawPuzzle/utils";
import { validateMemoryMatchData } from "./templates/MemoryMatch/utils";
import { 
  WordSearchData,
  generateWordSearchGrid 
} from "./templates/WordSearch";
import wordBankData from "./data/word-bank/words.json";
import { MemoryMatchData } from "./templates/MemoryMatch/types";
import fs from 'fs';
import path from 'path';

// Initialize empty puzzle registries that will be populated dynamically
export let wordScramblePuzzles: { [key: string]: () => Promise<WordScrambleData> } = {};
export let wordSearchPuzzles: { [key: string]: () => Promise<WordSearchData> } = {};
export let jigsawPuzzles: { [key: string]: () => Promise<any> } = {};
export let memoryMatchPuzzles: { [key: string]: () => Promise<any> } = {};

// Update getAvailablePuzzles to always return the current puzzles
export const getAvailablePuzzles = () => ({
  wordScramble: Object.keys(wordScramblePuzzles),
  jigsaw: Object.keys(jigsawPuzzles),
  wordSearch: Object.keys(wordSearchPuzzles),
  memoryMatch: Object.keys(memoryMatchPuzzles)
});

// Re-export the WordScrambleData and WordSearchData types
export type { WordScrambleData, WordSearchData, MemoryMatchData };

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


// Function to load word bank and filter by category for Memory Match
const loadMemoryMatchByCategory = async (category: string) => {
  try {
    const filteredWords = wordBankData.words.filter(word => 
      word.categories.includes(category)
    );
    
    if (filteredWords.length < 4) {
      throw new Error(`Not enough words found for category: ${category}`);
    }
    
    // Transform to the format expected by MemoryMatch component
    return validateMemoryMatchData({
      words: filteredWords.slice(0, 12), // Limit to 12 words for Memory Match
      difficulty: "medium", // Default difficulty
    });
  } catch (error) {
    console.error(`Error loading Memory Match words for category ${category}:`, error);
    throw error;
  }
};

// Function to convert category name to a URL-friendly slug
const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, "-");
};

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
      
      // Register the puzzle
      jigsawPuzzles[puzzleKey] = () => loadPuzzle(
        () => import(`./data/jigsaw/${fileName}.json`),
        validateJigsawConfig
      );
      
      console.log(`Added jigsaw puzzle: ${puzzleTitle} (key: ${puzzleKey})`);
    });
  } catch (error) {
    console.error("Error initializing jigsaw puzzles:", error);
    
    // Fallback to the static definition for environments where require.context isn't available
    jigsawPuzzles = {
      kaaba: () => loadPuzzle(
        () => import("./data/jigsaw/kaaba.json"), 
        validateJigsawConfig
      ),
      quran: () => loadPuzzle(
        () => import("./data/jigsaw/quran.json"),
        validateJigsawConfig
      )
    };
  }
};

// Function to initialize all puzzles
const initializePuzzles = () => {
  const validCategories = getWordBankCategories();
  console.log(`Found ${validCategories.length} categories with enough words:`, validCategories);
  
  // Reset puzzles
  wordScramblePuzzles = {};
  wordSearchPuzzles = {};
  memoryMatchPuzzles = {};
  
  // Build both puzzle types for each category
  validCategories.forEach(category => {
    const slug = categoryToSlug(category);
    
    // Add word scramble puzzle
    wordScramblePuzzles[slug] = () => loadWordBankByCategory(category);
    
    // Add word search puzzle
    wordSearchPuzzles[slug] = () => loadWordSearchByCategory(category);

    // Add memory match puzzle
    memoryMatchPuzzles[slug] = () => loadMemoryMatchByCategory(category);
    
    console.log(`Added puzzles for category: ${category} (slug: ${slug})`);
  });
  
  // Add general category if it has enough words
  if (getWordCountForCategory("General") >= 5) {
    const generalSlug = categoryToSlug("General");
    wordScramblePuzzles[generalSlug] = () => loadWordBankByCategory("General");
    wordSearchPuzzles[generalSlug] = () => loadWordSearchByCategory("General");
    console.log(`Added puzzles for General category`);
  }
  
  // Initialize jigsaw puzzles
  initializeJigsawPuzzles();
};

// Initialize puzzles immediately
initializePuzzles();

// Add an event handler for rebuilding puzzles
// This can be called after updating the words.json file programmatically
export const rebuildPuzzles = () => {
  initializePuzzles();
  return {
    wordScramble: Object.keys(wordScramblePuzzles),
    jigsaw: Object.keys(jigsawPuzzles),
    wordSearch: Object.keys(wordSearchPuzzles),
    memoryMatch: Object.keys(memoryMatchPuzzles)
  };
};
