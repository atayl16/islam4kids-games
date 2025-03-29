import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { JigsawPuzzle } from "../templates/JigsawPuzzle";
import { JIGSAW_DIFFICULTY_PRESETS } from "../templates/JigsawPuzzle/constants";
import { jigsawPuzzles } from "../registry";

// Define the expected structure of puzzle data
interface PuzzleData {
  meta: {
    title: string;
    defaultDifficulty?: string;
    learningObjectives?: string[];
    imageAlt?: string;
  };
  jigsawConfig: {
    imageSrc: string;
    [key: string]: any;
  };
}

export const JigsawPuzzleContainer = () => {
  const { puzzleSlug } = useParams<{ puzzleSlug: string }>();
  const [searchParams] = useSearchParams();
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get difficulty from query params if available
  const difficultyParam = searchParams.get('difficulty');
  const isValidDifficulty = difficultyParam && Object.keys(JIGSAW_DIFFICULTY_PRESETS).includes(difficultyParam);

  useEffect(() => {
    if (!puzzleSlug || !(puzzleSlug in jigsawPuzzles)) {
      setError("Puzzle not found");
      setLoading(false);
      return;
    }

    const loadPuzzle = async () => {
      try {
        // Get the puzzle function
        const puzzleFunction = jigsawPuzzles[puzzleSlug];
        
        // Call the puzzle loader function
        const data = await puzzleFunction();
        setPuzzleData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("Failed to load puzzle");
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [puzzleSlug, difficultyParam, isValidDifficulty]);

  if (loading) {
    return <div className="loading">Loading puzzle...</div>;
  }

  if (error || !puzzleData) {
    return <div className="error">{error || "Something went wrong"}</div>;
  }

  // If needed, merge in the difficulty from URL parameters
  const enhancedData = {
    ...puzzleData,
    meta: {
      ...puzzleData.meta,
      // If difficultyParam is valid, use it; otherwise keep the default or fall back to "medium"
      defaultDifficulty: isValidDifficulty ? difficultyParam : (puzzleData.meta.defaultDifficulty || "medium")
    }
  };

  return <JigsawPuzzle data={enhancedData} />;
};
