import { 
  getAvailablePuzzles, 
  wordScramblePuzzles,
  wordSearchPuzzles,
  jigsawPuzzles,
  rebuildPuzzles
} from "./registry";

// Mock the modules and data
jest.mock("./templates/WordScramble/utils", () => ({
  validateWordScrambleData: jest.fn(data => data),
  WordScrambleData: {}
}));

jest.mock("./templates/JigsawPuzzle/utils", () => ({
  validateJigsawConfig: jest.fn(data => data)
}));

jest.mock("./templates/WordSearch", () => ({
  generateWordSearchGrid: jest.fn((category, difficulty) => ({
    title: `${category} Word Search`,
    meta: {
      title: `${category} Word Search`,
      difficulty: difficulty,
      learningObjectives: ["test"],
      instructions: "test"
    },
    grid: [["A", "B"], ["C", "D"]],
    words: [{ word: "TEST", hint: "test" }],
    wordPlacements: []
  }))
}));

jest.mock("./data/word-bank/words.json", () => ({
  words: [
    { 
      term: "islam", 
      categories: ["Islamic-Terms"], 
      hints: ["Religion of peace"],
      translation: "peace" 
    },
    { 
      term: "quran", 
      categories: ["Islamic-Terms"], 
      hints: ["Holy book"],
      translation: "recitation" 
    },
    { 
      term: "salah", 
      categories: ["Islamic-Terms"], 
      hints: ["Prayer"],
      translation: "prayer" 
    },
    { 
      term: "zakat", 
      categories: ["Islamic-Terms"], 
      hints: ["Charity"],
      translation: "purification" 
    },
    { 
      term: "hajj", 
      categories: ["Islamic-Terms"], 
      hints: ["Pilgrimage"],
      translation: "pilgrimage" 
    }
  ]
}));

// Mock import for jigsaw puzzle
jest.mock("./data/jigsaw/kaaba.json", () => ({ 
  default: {
    id: "kaaba",
    meta: {
      title: "Kaaba Puzzle",
      difficulty: "easy",
      learningObjectives: ["Learn about Kaaba"],
      imageAlt: "Kaaba in Mecca"
    },
    jigsawConfig: {
      imageSrc: "/images/kaaba.jpg",
      rows: 3,
      columns: 3
    }
  }
}), { virtual: true });

describe("Games Registry", () => {
  describe("getAvailablePuzzles", () => {
    it("returns all available puzzle types and their slugs", () => {
      const puzzles = getAvailablePuzzles();
      
      expect(puzzles).toHaveProperty("wordScramble");
      expect(puzzles).toHaveProperty("wordSearch");
      expect(puzzles).toHaveProperty("jigsaw");
      
      // Check if we have the expected categories based on our mock data
      expect(puzzles.wordScramble).toContain("islamic-terms");
      expect(puzzles.wordSearch).toContain("islamic-terms");
      expect(puzzles.jigsaw).toContain("kaaba");
    });
  });
  
  describe("Dynamic puzzle registration", () => {
    it("creates word scramble puzzles for each valid category", () => {
      // Based on our mock data, only "Islamic-Terms" has enough words
      expect(Object.keys(wordScramblePuzzles)).toContain("islamic-terms");
    });
    
    it("creates word search puzzles for each valid category", () => {
      // Based on our mock data, only "Islamic-Terms" has enough words
      expect(Object.keys(wordSearchPuzzles)).toContain("islamic-terms");
    });
  });
  
  describe("Loading puzzles", () => {
    it("can load a jigsaw puzzle", async () => {
      // Since our mock returns the module with a default property, we need to adjust the test
      const result = await jigsawPuzzles.kaaba();
      const puzzle = result.default;
      
      expect(puzzle).toHaveProperty("meta");
      expect(puzzle).toHaveProperty("jigsawConfig");
      expect(puzzle.meta.title).toBe("Kaaba Puzzle");
    });
    
    it("can load a word scramble puzzle", async () => {
      const puzzle = await wordScramblePuzzles["islamic-terms"]();
      
      expect(puzzle).toHaveProperty("meta");
      expect(puzzle).toHaveProperty("words");
      expect(puzzle.meta.title).toBe("Islamic-Terms Word Scramble");
    });
    
    it("can load a word search puzzle", async () => {
      const puzzle = await wordSearchPuzzles["islamic-terms"]();
      
      expect(puzzle).toHaveProperty("meta");
      expect(puzzle).toHaveProperty("grid");
      expect(puzzle).toHaveProperty("words");
      expect(puzzle.title).toBe("Islamic-Terms Word Search");
    });
  });
  
  describe("rebuildPuzzles", () => {
    it("rebuilds the puzzle registries", () => {
      // First, simulate changing the puzzles
      const originalWordScramblePuzzles = { ...wordScramblePuzzles };
      const originalWordSearchPuzzles = { ...wordSearchPuzzles };
      
      // Temporarily clear the puzzles for testing
      Object.keys(wordScramblePuzzles).forEach(key => {
        delete wordScramblePuzzles[key];
      });
      
      Object.keys(wordSearchPuzzles).forEach(key => {
        delete wordSearchPuzzles[key];
      });
      
      expect(Object.keys(wordScramblePuzzles).length).toBe(0);
      expect(Object.keys(wordSearchPuzzles).length).toBe(0);
      
      // Rebuild puzzles
      const result = rebuildPuzzles();
      
      // Check that puzzles were rebuilt
      expect(Object.keys(wordScramblePuzzles).length).toBeGreaterThan(0);
      expect(Object.keys(wordSearchPuzzles).length).toBeGreaterThan(0);
      
      // Check the returned result
      expect(result).toHaveProperty("wordScramble");
      expect(result).toHaveProperty("wordSearch");
      expect(result.wordScramble.length).toBeGreaterThan(0);
      expect(result.wordSearch.length).toBeGreaterThan(0);
      
      // Restore original puzzles for other tests
      Object.keys(wordScramblePuzzles).forEach(key => {
        delete wordScramblePuzzles[key];
      });
      
      Object.keys(wordSearchPuzzles).forEach(key => {
        delete wordSearchPuzzles[key];
      });
      
      Object.keys(originalWordScramblePuzzles).forEach(key => {
        wordScramblePuzzles[key] = originalWordScramblePuzzles[key];
      });
      
      Object.keys(originalWordSearchPuzzles).forEach(key => {
        wordSearchPuzzles[key] = originalWordSearchPuzzles[key];
      });
    });
  });
  
  describe("Utility functions", () => {
    // Test the behavior of categoryToSlug (indirectly)
    it("converts category names to slugs properly", () => {
      // The registry should have created these slugs from our mock data
      expect(Object.keys(wordScramblePuzzles)).toContain("islamic-terms");
    });
  });
});
