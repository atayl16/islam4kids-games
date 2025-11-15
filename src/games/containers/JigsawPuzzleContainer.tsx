import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { JigsawPuzzle } from "../templates/JigsawPuzzle";
import { JIGSAW_DIFFICULTY_PRESETS } from "../templates/JigsawPuzzle/constants";
import { jigsawPuzzles } from "../registry";
import { JigsawConfig } from "../templates/JigsawPuzzle/types";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const JigsawPuzzleContainer = () => {
  const { puzzleSlug } = useParams<{ puzzleSlug: string }>();
  const [searchParams] = useSearchParams();
  const [puzzleData, setPuzzleData] = useState<JigsawConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get difficulty from query params if available
  const difficultyParam = searchParams.get('difficulty');
  const isValidDifficulty = difficultyParam && Object.keys(JIGSAW_DIFFICULTY_PRESETS).includes(difficultyParam);

  useEffect(() => {
    let isMounted = true;

    // Reinitialize state at the start of each puzzle fetch
    setLoading(true);
    setError(null);
    setPuzzleData(null);

    if (!puzzleSlug || !(puzzleSlug in jigsawPuzzles)) {
      if (isMounted) {
        setError("Puzzle not found");
        setLoading(false);
        setPuzzleData(null);
      }
      return;
    }

    const loadPuzzle = async () => {
      try {
        // Get the puzzle function
        const puzzleFunction = jigsawPuzzles[puzzleSlug as keyof typeof jigsawPuzzles];

        // Call the puzzle loader function
        const data = await puzzleFunction();
        if (isMounted) {
          setPuzzleData(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load puzzle:", err);
          setError("Failed to load puzzle");
          setPuzzleData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPuzzle();

    return () => {
      isMounted = false;
    };
  }, [puzzleSlug, difficultyParam, isValidDifficulty]);

  if (loading) {
    return <LoadingSpinner message="Loading Jigsaw Puzzle..." />;
  }

  if (error || !puzzleData) {
    return <div className="error-message">{error || "Something went wrong"}</div>;
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
