import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WordScramble } from "../templates/WordScramble";
import { wordScramblePuzzles } from "../registry";

export const WordScrambleContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameSlug || !wordScramblePuzzles[gameSlug]) {
      setError("Puzzle not found");
      setLoading(false);
      return;
    }

    const loadPuzzle = async () => {
      try {
        const data = await wordScramblePuzzles[gameSlug]();
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

  if (loading) {
    return <div className="loading">Loading puzzle...</div>;
  }

  if (error || !puzzleData) {
    return <div className="error">{error || "Something went wrong"}</div>;
  }

  return <WordScramble data={puzzleData} />;
};
