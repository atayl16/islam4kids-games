import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WordScramble } from "../templates/WordScramble";
import { wordScramblePuzzles, WordScrambleData } from "../registry";

export const WordScrambleContainer = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [puzzleData, setPuzzleData] = useState<WordScrambleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!gameSlug || !(gameSlug in wordScramblePuzzles)) {
      if (isMounted) {
        setError("Puzzle not found");
        setLoading(false);
      }
      return;
    }

    const loadPuzzle = async () => {
      try {
        const data = await (wordScramblePuzzles as Record<string, () => Promise<WordScrambleData>>)[gameSlug]();
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

  if (loading) {
    return <div className="loading">Loading puzzle...</div>;
  }

  if (error || !puzzleData) {
    return <div className="error">{error || "Something went wrong"}</div>;
  }

  return <WordScramble data={puzzleData} />;
};
