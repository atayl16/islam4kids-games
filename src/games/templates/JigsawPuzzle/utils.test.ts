import { validateJigsawConfig } from "./utils";
import { JigsawConfig } from "./types";

describe("validateJigsawConfig", () => {
  const validConfig: JigsawConfig = {
    meta: {
      title: "Test Puzzle",
      defaultDifficulty: "easy",
      learningObjectives: ["Learn about Islam"],
      imageAlt: "Test image",
    },
    jigsawConfig: {
      imageSrc: "test-image.jpg",
      rows: 3,
      columns: 3,
    },
  };

  it("should validate a correct config", () => {
    expect(() => validateJigsawConfig(validConfig)).not.toThrow();
    const result = validateJigsawConfig(validConfig);
    expect(result).toEqual(validConfig);
  });

  it("should throw an error if data is null or undefined", () => {
    expect(() => validateJigsawConfig(null)).toThrow("Jigsaw puzzle data is required");
    expect(() => validateJigsawConfig(undefined)).toThrow("Jigsaw puzzle data is required");
  });

  it("should throw an error if imageSrc is missing", () => {
    const missingImageConfig = {
      ...validConfig,
      jigsawConfig: {
        ...validConfig.jigsawConfig,
        imageSrc: undefined,
      },
    };
    expect(() => validateJigsawConfig(missingImageConfig)).toThrow("Jigsaw puzzle image source is required");
  });

  it("should throw an error if title is missing", () => {
    const missingTitleConfig = {
      ...validConfig,
      meta: {
        ...validConfig.meta,
        title: undefined,
      },
    };
    expect(() => validateJigsawConfig(missingTitleConfig)).toThrow("Jigsaw puzzle title is required");
  });

  it("should set default difficulty to 'medium' if not provided", () => {
    const noDifficultyConfig = {
      ...validConfig,
      meta: {
        ...validConfig.meta,
        defaultDifficulty: undefined,
      },
    };
    const result = validateJigsawConfig(noDifficultyConfig);
    expect(result.meta.defaultDifficulty).toBe("medium");
  });

  it("should allow rows and columns to be optional", () => {
    const noRowsColumnsConfig = {
      ...validConfig,
      jigsawConfig: {
        ...validConfig.jigsawConfig,
        rows: undefined,
        columns: undefined,
      },
    };
    expect(() => validateJigsawConfig(noRowsColumnsConfig)).not.toThrow();
    const result = validateJigsawConfig(noRowsColumnsConfig);
    expect(result.jigsawConfig.rows).toBeUndefined();
    expect(result.jigsawConfig.columns).toBeUndefined();
  });
});
