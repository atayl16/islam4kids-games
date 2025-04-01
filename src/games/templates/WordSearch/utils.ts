// src/templates/WordSearch/utils.ts
import { WordSearchData } from "./types";
import wordBankData from "../../data/word-bank/words.json";

interface WordPosition {
  row: number;
  col: number;
}

interface WordPlacement {
  word: string;
  positions: WordPosition[];
}

export const generateWordSearchGrid = (
  category: string,
  difficulty: string = "medium"
): WordSearchData => {
  console.log("Generating grid for category:", category, "with difficulty:", difficulty);

  // Filter words from the word bank based on category and difficulty
  const filteredWords = wordBankData.words
    .filter(item => {
      // Check if category matches
      const categoryMatch = category === "general" || 
        (item.categories && item.categories.includes(category));
      
      // Filter by word length based on difficulty
      const length = item.term.length;
      const difficultyMatch = 
        difficulty === "easy" ? length <= 5 :
        difficulty === "medium" ? length <= 7 : true;
      
      return categoryMatch && difficultyMatch;
    })
    .map(item => item.term.toUpperCase());

  // Add fallback words if no matching words are found
  let selectedWords = filteredWords;
  if (filteredWords.length === 0) {
    console.warn(`No words found for category: ${category}. Using fallback words.`);
    selectedWords = ["ISLAM", "QURAN", "PRAYER", "FAITH", "PEACE"];
  }

  // Select a random subset of words based on difficulty
  const wordCount = 
    difficulty === "easy" ? 5 : 
    difficulty === "medium" ? 8 : 12;
  selectedWords = selectedWords.slice(0, Math.min(wordCount, selectedWords.length));

  // Determine grid size based on difficulty
  const size = 
    difficulty === "easy" ? 8 : 
    difficulty === "medium" ? 10 : 12;

  // Generate the grid and word placements
  const { grid, wordPlacements } = createWordSearchGrid(selectedWords, size, difficulty);

  console.log("Generated grid:", grid);
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Word Search`,
    grid,
    words: selectedWords.map(word => ({
      word,
      hint: "", // Could add hints if available in word bank
    })),
    wordPlacements,
    meta: {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Word Search`,
      instructions: "Find all the hidden words in the grid",
      difficulty: difficulty as "easy" | "medium" | "hard",
      learningObjectives: ["Vocabulary recognition", "Visual scanning"],
    },
  };
};

const createWordSearchGrid = (
  words: string[],
  size: number,
  difficulty: string
): { grid: string[][], wordPlacements: WordPlacement[] } => {
  // Initialize empty grid
  let grid: string[][] = Array(size).fill(0).map(() => Array(size).fill(""));
  
  // Directions: horizontal, vertical, diagonal down, diagonal up
  const directions = difficulty === "easy"
    ? [ // No diagonals for Easy
        { row: 0, col: 1 }, // horizontal
        { row: 1, col: 0 }  // vertical
      ]
    : [ // Include diagonals for Medium and Hard
        { row: 0, col: 1 }, { row: 1, col: 0 },
        { row: 1, col: 1 }, { row: 1, col: -1 }
      ];

  // Word placements to track where words are in the grid
  const wordPlacements: WordPlacement[] = [];
  
  // Try to place each word
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 50) {
      attempts++;
      
      // Random direction and starting position
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      
      if (
        startRow + (word.length - 1) * direction.row >= 0 &&
        startRow + (word.length - 1) * direction.row < size &&
        startCol + (word.length - 1) * direction.col >= 0 &&
        startCol + (word.length - 1) * direction.col < size
      ) {
        // Check if placement conflicts with existing letters
        let canPlace = true;
        let positions: WordPosition[] = [];
        
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction.row;
          const col = startCol + i * direction.col;
          positions.push({ row, col });
          
          if (grid[row][col] !== "" && grid[row][col] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          // Place the word on the grid
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction.row;
            const col = startCol + i * direction.col;
            grid[row][col] = word[i];
          }
          
          wordPlacements.push({ word, positions });
          placed = true;
        }
      }
    }
    
    // If we failed to place the word after many attempts
    if (!placed) {
      console.warn(`Could not place word: ${word} after 50 attempts`);
    }
  }
  
  // Fill empty cells with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === "") {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  
  return { grid, wordPlacements };
};

export const validateWordSearchData = (data: unknown): WordSearchData => {
  // Basic validation to ensure required properties exist
  const validData = data as WordSearchData;
  if (!validData || !validData.grid || !validData.words || !validData.meta) {
    throw new Error("Invalid word search data structure");
  }
  
  if (!Array.isArray(validData.grid) || !Array.isArray(validData.words)) {
    throw new Error("Grid and words must be arrays");
  }
  
  return validData;
};
