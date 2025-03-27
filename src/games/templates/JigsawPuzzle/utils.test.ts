import { validateJigsawConfig } from "./utils";
import { JigsawConfig } from "./types";

describe("validateJigsawConfig", () => {
  const validConfig: JigsawConfig = {
    meta: {
      title: "Test Puzzle",
      difficulty: "easy",
      learningObjectives: ["Learn about Islam"],
      imageAlt: "Test image"
    },
    jigsawConfig: {
      imageSrc: "test-image.jpg",
      rows: 3,
      columns: 3
    }
  };

  it("should validate a correct config", () => {
    expect(() => validateJigsawConfig(validConfig)).not.toThrow();
    const result = validateJigsawConfig(validConfig);
    expect(result).toEqual(validConfig);
  });

  it("should throw an error for null or undefined input", () => {
    expect(() => validateJigsawConfig(null)).toThrow("Invalid jigsaw puzzle data");
    expect(() => validateJigsawConfig(undefined)).toThrow("Invalid jigsaw puzzle data");
  });

  it("should throw an error for non-object input", () => {
    expect(() => validateJigsawConfig("string")).toThrow("Invalid jigsaw puzzle data");
    expect(() => validateJigsawConfig(123)).toThrow("Invalid jigsaw puzzle data");
    expect(() => validateJigsawConfig(true)).toThrow("Invalid jigsaw puzzle data");
  });

  it("should throw an error for invalid difficulty level", () => {
    const invalidDifficulty = {
      ...validConfig,
      meta: {
        ...validConfig.meta,
        difficulty: "invalid" as any
      }
    };
    expect(() => validateJigsawConfig(invalidDifficulty)).toThrow("Invalid difficulty level: invalid");
  });

  it("should throw an error if puzzle is too large", () => {
    const tooLargeConfig = {
      ...validConfig,
      jigsawConfig: {
        ...validConfig.jigsawConfig,
        rows: 11,
        columns: 10 // 11 * 10 = 110 pieces (> 100)
      }
    };
    expect(() => validateJigsawConfig(tooLargeConfig)).toThrow("Puzzle too large (max 100 pieces)");
  });
});
