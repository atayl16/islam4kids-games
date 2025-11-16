import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WordSearch } from "../templates/WordSearch";
import { wordSearchPuzzles, WordSearchData } from "../registry";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const WordSearchContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [puzzleData, setPuzzleData] = useState<WordSearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!gameSlug || !(gameSlug in wordSearchPuzzles)) {
      if (isMounted) {
        setError("Puzzle not found");
        setLoading(false);
      }
      return;
    }

    const loadPuzzle = async () => {
      try {
        const data = await wordSearchPuzzles[gameSlug]();
        if (isMounted) {
          setPuzzleData(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load puzzle:", err);
          setError("Failed to load puzzle");
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
  }, [gameSlug]);

  if (loading) return <LoadingSpinner message="Loading Word Search..." />;
  if (error || !puzzleData)
    return <div className="error-message">{error || "Something went wrong"}</div>;

  // Extract the category from the puzzle data
  const category = puzzleData.words[0]?.categories?.[0] || "general";

  return <WordSearch data={puzzleData} category={category} gameSlug={gameSlug || 'unknown'} />;
};
