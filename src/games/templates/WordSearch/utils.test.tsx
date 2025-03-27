import { generateWordSearchGrid, validateWordSearchData } from "./utils";
import { WordSearchData } from "./types";

// Mock the word bank data
jest.mock("../../data/word-bank/words.json", () => ({
  words: [
    { term: "islam", categories: ["islamic-terms"] },
    { term: "quran", categories: ["islamic-terms"] },
    { term: "salah", categories: ["islamic-terms"] },
    { term: "muhammad", categories: ["prophets"] },
    { term: "ibrahim", categories: ["prophets"] },
    { term: "ramadan", categories: ["ramadan"] }
  ]
}));

describe("WordSearch Utilities", () => {
  describe("generateWordSearchGrid", () => {
    it("generates a grid with the correct size based on difficulty", () => {
      const easyGrid = generateWordSearchGrid("islamic-terms", "easy");
      const mediumGrid = generateWordSearchGrid("islamic-terms", "medium");
      const hardGrid = generateWordSearchGrid("islamic-terms", "hard");
      
      // Easy grid should be 8x8
      expect(easyGrid.grid.length).toBe(8);
      expect(easyGrid.grid[0].length).toBe(8);
      
      // Medium grid should be 10x10
      expect(mediumGrid.grid.length).toBe(10);
      expect(mediumGrid.grid[0].length).toBe(10);
      
      // Hard grid should be 12x12
      expect(hardGrid.grid.length).toBe(12);
      expect(hardGrid.grid[0].length).toBe(12);
    });

    it("filters words based on category", () => {
      const prophetGrid = generateWordSearchGrid("prophets", "medium");
      
      // Should contain words from the prophets category
      const words = prophetGrid.words.map(w => w.word);
      expect(words.some(w => ["MUHAMMAD", "IBRAHIM"].includes(w))).toBeTruthy();
      
      // Should not contain words from other categories
      expect(words.some(w => w === "SALAH")).toBeFalsy();
    });

    it("filters words based on difficulty", () => {
      // Easy difficulty should include shorter words
      const easyGrid = generateWordSearchGrid("islamic-terms", "easy");
      
      easyGrid.words.forEach(word => {
        expect(word.word.length).toBeLessThanOrEqual(5);
      });
    });

    it("uses fallback words when no matches found", () => {
      // Use a non-existent category
      const grid = generateWordSearchGrid("non-existent", "medium");
      
      // Should still have words (fallback)
      expect(grid.words.length).toBeGreaterThan(0);
      
      // Should include some of the fallback words
      const words = grid.words.map(w => w.word);
      const fallbacks = ['MASJID', 'PRAYER', 'FAITH', 'PEACE', 'KINDNESS'];
      expect(words.some(w => fallbacks.includes(w))).toBeTruthy();
    });

    it("includes word placements for all words", () => {
      const grid = generateWordSearchGrid("islamic-terms", "easy");
      
      // Each word should have corresponding positions
      grid.words.forEach(wordObj => {
        const placement = grid.wordPlacements.find(p => p.word === wordObj.word);
        expect(placement).toBeDefined();
        expect(placement?.positions.length).toBe(wordObj.word.length);
      });
    });
  });

  describe("validateWordSearchData", () => {
    const validData: WordSearchData = {
      title: "Test",
      meta: {
        title: "Test",
        difficulty: "easy",
        learningObjectives: ["test"],
        instructions: "Find words"
      },
      grid: [["A", "B"], ["C", "D"]],
      words: [{ word: "AB", hint: "Test" }],
      wordPlacements: [{ 
        word: "AB", 
        positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }] 
      }]
    };

    it("returns the data unchanged when it's valid", () => {
      expect(validateWordSearchData(validData)).toEqual(validData);
    });

    it("throws an error for null or undefined input", () => {
      expect(() => validateWordSearchData(null)).toThrow("Invalid word search data structure");
      expect(() => validateWordSearchData(undefined)).toThrow("Invalid word search data structure");
    });

    it("throws an error when grid is missing", () => {
      const invalidData = { ...validData, grid: undefined };
      expect(() => validateWordSearchData(invalidData)).toThrow("Invalid word search data structure");
    });

    it("throws an error when words are missing", () => {
      const invalidData = { ...validData, words: undefined };
      expect(() => validateWordSearchData(invalidData)).toThrow("Invalid word search data structure");
    });

    it("throws an error when meta is missing", () => {
      const invalidData = { ...validData, meta: undefined };
      expect(() => validateWordSearchData(invalidData)).toThrow("Invalid word search data structure");
    });

    it("throws an error when grid or words are not arrays", () => {
      const invalidGrid = { ...validData, grid: "not an array" };
      const invalidWords = { ...validData, words: "not an array" };
      
      expect(() => validateWordSearchData(invalidGrid)).toThrow("Grid and words must be arrays");
      expect(() => validateWordSearchData(invalidWords)).toThrow("Grid and words must be arrays");
    });
  });
});
