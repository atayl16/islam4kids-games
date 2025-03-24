import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { JigsawPuzzle } from "../templates/JigsawPuzzle";
import { jigsawPuzzles } from "../registry";

export const JigsawPuzzleContainer = () => {
  const { puzzleSlug } = useParams<{ puzzleSlug: string }>();
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!puzzleSlug || !jigsawPuzzles[puzzleSlug]) {
      setError("Puzzle not found");
      setLoading(false);
      return;
    }

    const loadPuzzle = async () => {
      try {
        const data = await jigsawPuzzles[puzzleSlug]();
        setPuzzleData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("Failed to load puzzle");
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [puzzleSlug]);

  if (loading) {
    return <div className="loading">Loading puzzle...</div>;
  }

  if (error || !puzzleData) {
    return <div className="error">{error || "Something went wrong"}</div>;
  }

  return <JigsawPuzzle data={puzzleData} />;
};
