import { WordScrambleData } from "./templates/WordScramble/utils";
import { validateMemoryMatchData } from "./templates/MemoryMatch/utils";
import {
  WordSearchData,
  generateWordSearchGrid
} from "./templates/WordSearch";
import wordBankData from "./data/word-bank/words.json";
import { MemoryMatchData } from "./templates/MemoryMatch/types";
import { shuffleArray } from "./templates/QuizGame/utils";
import { WordBankEntry } from "../types/WordBank";
import { JigsawConfig } from "./templates/JigsawPuzzle/types";
import { QuizQuestion } from "./templates/QuizGame/types";

// Initialize empty puzzle registries that will be populated dynamically
export let wordScramblePuzzles: { [key: string]: () => Promise<WordScrambleData> } = {};
export let wordSearchPuzzles: { [key: string]: () => Promise<WordSearchData> } = {};
export let jigsawPuzzles: { [key: string]: () => Promise<JigsawConfig> } = {};
export let memoryMatchPuzzles: { [key: string]: () => Promise<MemoryMatchData> } = {};

// Update getAvailablePuzzles to always return the current puzzles
export const getAvailablePuzzles = () => ({
  wordScramble: Object.keys(wordScramblePuzzles),
  wordSearch: Object.keys(wordSearchPuzzles),
  memoryMatch: Object.keys(memoryMatchPuzzles),
  jigsaw: Object.keys(jigsawPuzzles),
  quizGame: Object.keys(quizGamePuzzles),
});

// Re-export the WordScrambleData and WordSearchData types
export type { WordScrambleData, WordSearchData, MemoryMatchData };

// Helper function to count words for a given category
const getWordCountForCategory = (category: string): number => {
  return wordBankData.words.filter(word => 
    word.categories.includes(category)
  ).length;
};

const getWordBankCategories = (): string[] => {
  try {
    const categoryMap = new Map<string, number>();

    // Count words per category
    wordBankData.words.forEach((word) => {
      if (word.categories) {
        word.categories.forEach((category) => {
          const currentCount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCount + 1);
        });
      }
    });

    // Filter categories with enough words (e.g., at least 4 words for a quiz)
    const MIN_WORDS_FOR_QUIZ = 4;
    return Array.from(categoryMap.entries())
      .filter(([_, count]) => count >= MIN_WORDS_FOR_QUIZ)
      .map(([category]) => category);
  } catch (error) {
    console.error("Error processing word bank categories:", error);
    return [];
  }
};

// Function to load word bank and filter by category
const loadWordBankByCategory = async (category: string): Promise<WordBankEntry[]> => {
  try {
    const filteredWords = wordBankData.words.filter(word =>
      word.categories.includes(category)
    );

    if (filteredWords.length === 0) {
      throw new Error(`No words found for category: ${category}`);
    }

    return filteredWords.map(word => ({
      ...word,
      references: (word as any).references || [],
      games: (word as any).games || []
    }));
  } catch (error) {
    console.error(`Error loading words for category ${category}:`, error);
    throw error;
  }
};

const loadWordScrambleByCategory = async (category: string): Promise<WordScrambleData> => {
  try {
    const filteredWords = await loadWordBankByCategory(category);
    
    // Transform to the format expected by WordScramble component
    return {
      meta: {
        title: `${category} Word Scramble`,
        difficulty: "medium", // Default difficulty
        learningObjectives: ["Vocabulary recognition", "Spelling practice"],
        instructions: `Rearrange the letters to form ${category.toLowerCase()} terms`
      },
      words: filteredWords.map(word => ({
        solution: word.term,
        hint: word.hints[0] || word.translation || "No hint available",
        reference: word.references[0] || ""
      }))
    };
  } catch (error) {
    console.error(`Error loading Word Scramble for category ${category}:`, error);
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
    // Use Vite's import.meta.glob to dynamically include all image files
    const imageFiles = import.meta.glob("/public/images/jigsaw/*.{jpg,png}", {
      eager: true,
    });

    // Reset jigsaw puzzles
    jigsawPuzzles = {};

    Object.keys(imageFiles).forEach((filePath) => {
      // Extract the filename from the file path
      const fileName = filePath.split("/").pop()?.replace(/\.(jpg|png)$/i, "");
      if (!fileName) return;

      const puzzleKey = fileName.toLowerCase();
      const puzzleTitle = slugToTitle(puzzleKey);

      // Register the puzzle
      jigsawPuzzles[puzzleKey] = async () => ({
        jigsawConfig: {
          imageSrc: `/images/jigsaw/${fileName}.${filePath.split(".").pop()}`, // Correct URL path for public assets
        },
        meta: {
          title: puzzleTitle,
          defaultDifficulty: "medium", // Default difficulty
        },
      });
    });
  } catch (error) {
    console.error("Error initializing jigsaw puzzles:", error);
  }
};

export const quizGamePuzzles: { [key: string]: () => Promise<QuizQuestion[]> } = {};

// Update the quiz game initialization in registry.ts
const initializeQuizGamePuzzles = () => {
  const validCategories = getWordBankCategories();
  validCategories.forEach((category) => {
    const slug = categoryToSlug(category);
    quizGamePuzzles[slug] = async () => {
      try {
        const words = await loadWordBankByCategory(category);
        
        // Filter out any entries with missing terms or translations
        const validWords = words.filter(word => 
          word.term && word.translation && word.term.trim() !== "" && word.translation.trim() !== ""
        );
        
        if (validWords.length < 4) {
          throw new Error(`Not enough valid words found for category: ${category}`);
        }
        
        return validWords.map((word) => {
          // Randomly decide if we ask for term or translation
          const questionType = Math.random() < 0.5 ? "translation" : "term";
          
          // Generate incorrect options from other words
          const otherWords = validWords.filter(w => w.id !== word.id);
          const incorrectOptions = shuffleArray(otherWords).slice(0, 3);
          
          if (questionType === "translation") {
            return {
              id: word.id,
              question: `What is the translation for "${word.term}"?`,
              correctAnswer: word.translation,
              options: shuffleArray([
                word.translation,
                ...incorrectOptions.map(w => w.translation)
              ]).slice(0, 4), // Ensure only 4 options
              term: word.term,
              translation: word.translation,
              hint: word.hints?.[0] || "No hint available"
            };
          } else {
            return {
              id: word.id,
              question: `What is the term for "${word.translation}"?`,
              correctAnswer: word.term,
              options: shuffleArray([
                word.term,
                ...incorrectOptions.map(w => w.term)
              ]).slice(0, 4), // Ensure only 4 options
              term: word.term,
              translation: word.translation,
              hint: word.hints?.[0] || "No hint available"
            };
          }
        });
      } catch (error) {
        console.error(`Error creating quiz for category ${category}:`, error);
        throw error;
      }
    };
  });
};

// Initialize quiz games
initializeQuizGamePuzzles();

// Function to initialize all puzzles
const initializePuzzles = () => {
  const validCategories = getWordBankCategories();

  // Reset puzzles
  wordScramblePuzzles = {};
  wordSearchPuzzles = {};
  memoryMatchPuzzles = {};
  
  // Build both puzzle types for each category
  validCategories.forEach(category => {
    const slug = categoryToSlug(category);
    
    // Add word scramble puzzle
    wordScramblePuzzles[slug] = () => loadWordScrambleByCategory(category);

    // Add word search puzzle
    wordSearchPuzzles[slug] = () => loadWordSearchByCategory(category);

    // Add memory match puzzle
    memoryMatchPuzzles[slug] = () => loadMemoryMatchByCategory(category);
  });
  
  // Add general category if it has enough words
  if (getWordCountForCategory("General") >= 5) {
    const generalSlug = categoryToSlug("General");
    wordScramblePuzzles[generalSlug] = () => loadWordScrambleByCategory("General");
    wordSearchPuzzles[generalSlug] = () => loadWordSearchByCategory("General");
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
