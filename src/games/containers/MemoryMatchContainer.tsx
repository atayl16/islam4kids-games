import React, { useState, useEffect } from "react";
import { MemoryMatch } from "../templates/MemoryMatch";
import { MemoryMatchData } from "../templates/MemoryMatch/types";
import { useParams } from "react-router-dom";
import { memoryMatchPuzzles } from "../registry";

export const MemoryMatchContainer: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [gameData, setGameData] = useState<MemoryMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGameData = async () => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        if (!categorySlug || !memoryMatchPuzzles[categorySlug]) {
          throw new Error("Invalid or missing category.");
        }

        const data = await memoryMatchPuzzles[categorySlug]();
        if (isMounted) {
          setGameData(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading Memory Match game data:", err);
          setError("Failed to load game data. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGameData();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!gameData) {
    return <div>No game data available.</div>;
  }

  return <MemoryMatch words={gameData.words} />;
};
