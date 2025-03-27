import { validateWordScrambleData, WordScrambleData } from "./utils";

describe("validateWordScrambleData", () => {
  const validData: WordScrambleData = {
    meta: {
      title: "Islamic Terms",
      difficulty: "easy",
      learningObjectives: ["Learn Islamic terms"],
      instructions: "Rearrange the letters to form the correct word"
    },
    words: [
      {
        solution: "ISLAM",
        hint: "The religion of peace",
        reference: "Quran 3:19"
      }
    ]
  };

  it("returns the data unchanged when it's valid", () => {
    expect(validateWordScrambleData(validData)).toEqual(validData);
  });

  it("throws an error for null or undefined input", () => {
    expect(() => validateWordScrambleData(null)).toThrow("Invalid game data");
    expect(() => validateWordScrambleData(undefined)).toThrow("Invalid game data");
  });

  it("throws an error for non-object input", () => {
    expect(() => validateWordScrambleData("string")).toThrow("Invalid game data");
    expect(() => validateWordScrambleData(123)).toThrow("Invalid game data");
    expect(() => validateWordScrambleData(true)).toThrow("Invalid game data");
  });

  it("throws an error when words array is missing", () => {
    const missingWords = { ...validData, words: undefined };
    expect(() => validateWordScrambleData(missingWords)).toThrow("Game data must include words array");
  });

  it("throws an error when words array is empty", () => {
    const emptyWords = { ...validData, words: [] };
    expect(() => validateWordScrambleData(emptyWords)).toThrow("Game data must include words array");
  });
});
