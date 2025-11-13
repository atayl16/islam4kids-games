import { JigsawConfig } from "./types";
import { AUDIO_FILES } from "./constants";

export const validateJigsawConfig = (data: any): JigsawConfig => {
  // Validate required fields
  if (!data) {
    throw new Error("Jigsaw puzzle data is required");
  }
  
  if (!data.jigsawConfig || !data.jigsawConfig.imageSrc) {
    throw new Error("Jigsaw puzzle image source is required");
  }
  
  // Validate meta fields
  if (!data.meta || !data.meta.title) {
    throw new Error("Jigsaw puzzle title is required");
  }

  // Default difficulty if not provided
  if (!data.meta.defaultDifficulty) {
    data.meta.defaultDifficulty = "medium";
  }
  
  // Rows and columns are now optional since they can come from difficulty presets
  
  return data;
};

// Shuffle array utility
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Play sound with proper error handling
export const playSound = (soundFile: string, volume = 0.5) => {
  try {
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play().catch(() => {
      // Silent catch for browsers that block autoplay
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Play specific sounds
export const playSnapSound = () => {
  playSound(AUDIO_FILES.SNAP, 0.5);
};

export const playCompletionSound = () => {
  playSound(AUDIO_FILES.COMPLETE, 0.7);
};
