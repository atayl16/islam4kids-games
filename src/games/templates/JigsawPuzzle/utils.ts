import { JigsawConfig } from "./types";

export const validateJigsawConfig = (data: unknown): JigsawConfig => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid jigsaw puzzle data");
  }

  const config = data as JigsawConfig;

  // Validate difficulty
  if (!["easy", "medium", "hard"].includes(config.meta.difficulty)) {
    throw new Error(`Invalid difficulty level: ${config.meta.difficulty}`);
  }

  // Validate dimensions
  if (config.jigsawConfig.rows * config.jigsawConfig.columns > 100) {
    throw new Error("Puzzle too large (max 100 pieces)");
  }

  return config;
};
