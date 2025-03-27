// src/containers/WordSearchContainer.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WordSearch } from "../templates/WordSearch";
import { wordSearchPuzzles, WordSearchData } from "../registry";

export const WordSearchContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [puzzleData, setPuzzleData] = useState<WordSearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameSlug || !(gameSlug in wordSearchPuzzles)) {
      setError("Puzzle not found");
      setLoading(false);
      return;
    }

    const loadPuzzle = async () => {
      try {
        const data = await wordSearchPuzzles[gameSlug]();
        setPuzzleData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("Failed to load puzzle");
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [gameSlug]);

  if (loading) return <div className="loading">Loading puzzle...</div>;
  if (error || !puzzleData)
    return <div className="error">{error || "Something went wrong"}</div>;

  return <WordSearch data={puzzleData} />;
};
