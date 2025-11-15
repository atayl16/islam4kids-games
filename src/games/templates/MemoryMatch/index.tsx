import { useState, useEffect } from "react";
import { WordBankEntry } from "../../../types/WordBank";
import { MemoryCard as MemoryCardComponent } from "./MemoryCard";
import { initializeCards } from "./utils";
import { MemoryCard } from "./types";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";

type Props = {
  words: WordBankEntry[];
};

export const MemoryMatch = ({ words }: Props) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for overlay visibility

  // Initialize the cards when the game starts or difficulty changes
  useEffect(() => {
    try {
      const initialCards = initializeCards(words, difficulty);
      setCards(initialCards);
      setMoves(0);
      setFlippedIds([]);
      setError(null);
      setIsOverlayVisible(false); // Reset overlay visibility
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  }, [difficulty, words]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (flippedIds.length < 2 && !flippedIds.includes(cardId)) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      setFlippedIds((prev) => [...prev, cardId]);
    }
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIds.length === 2) {
      const [firstCard, secondCard] = flippedIds.map((id) =>
        cards.find((card) => card.id === id)
      );

      if (firstCard && secondCard) {
        const isMatch = firstCard.word.id === secondCard.word.id;

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => {
              if (flippedIds.includes(card.id)) {
                if (isMatch) {
                  return { ...card, isFlipped: true, isMatched: true };
                }
                return { ...card, isFlipped: false, isMatched: false };
              }
              return card;
            })
          );
          setFlippedIds([]);
        }, 1000);

        setMoves((prev) => prev + 1);
      }
    }
  }, [flippedIds, cards]);

  // Reset the game
  const resetGame = () => {
    try {
      const initialCards = initializeCards(words, difficulty);
      setCards(initialCards);
      setMoves(0);
      setFlippedIds([]);
      setError(null);
      setIsOverlayVisible(false); // Reset overlay visibility
    } catch (err) {
      setError(`Couldn't create a game. You need at least 3 words to play.`);
      setCards([]);
    }
  };

  const matchedCards = cards.filter((c) => c.isMatched).length;
  const totalPairs = cards.length / 2;
  const isGameComplete = matchedCards === cards.length && cards.length > 0;

  // Show overlay when the game is complete
  useEffect(() => {
    if (isGameComplete) {
      setIsOverlayVisible(true);
    }
  }, [isGameComplete]);

  // Get grid columns based on difficulty
  const getGridCols = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-3 sm:grid-cols-4";
      case "medium":
        return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6";
      case "hard":
        return "grid-cols-4 sm:grid-cols-6 md:grid-cols-8";
      default:
        return "grid-cols-4";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent mb-3">
          Memory Match
        </h2>
        <p className="text-lg md:text-xl text-slate-600">
          Match all the cards to complete the game. Select a difficulty to start.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-6 text-center">
          <p className="text-amber-600 font-medium text-lg">{error}</p>
        </div>
      )}

      {/* Controls */}
      <PuzzleControls
        currentDifficulty={difficulty}
        onDifficultyChange={(difficulty: string) => {
          setDifficulty(difficulty as "easy" | "medium" | "hard");
        }}
        onScramble={resetGame}
        solvedCount={matchedCards / 2}
        totalPieces={totalPairs}
        difficultyOptions={[
          { value: "easy", label: "Easy" },
          { value: "medium", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
        scrambleLabel="Reset Game"
        progressLabel={(solved, total) => `Matches: ${solved}/${total}`}
        hintButton={
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-5 py-2.5 rounded-xl font-medium bg-white text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-50 transition-all duration-200 hover:shadow-lg"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        }
      />

      {/* Hint Box */}
      {showHint && (
        <div className="bg-violet-50 border-2 border-violet-500 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-violet-700 mb-2">Hint:</h3>
          <p className="text-violet-600">Try to remember the positions of the cards!</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className={`grid ${getGridCols()} gap-3 md:gap-4 justify-items-center`}>
        {cards.map((card) => (
          <MemoryCardComponent
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={
              card.isMatched || flippedIds.length === 2 || card.isFlipped
            }
            data-testid="memory-card"
            data-word-id={card.word.id}
          />
        ))}
      </div>

      {/* Status */}
      <div className="flex justify-center gap-8 text-lg font-medium text-slate-700">
        <p>Moves: <span className="text-emerald-600 font-bold">{moves}</span></p>
        <p>Matches: <span className="text-violet-600 font-bold">{matchedCards / 2} / {totalPairs}</span></p>
      </div>

      {/* Completion Overlay */}
      <CompletionOverlay
        isVisible={isOverlayVisible}
        setIsVisible={setIsOverlayVisible}
        title="Mashallah! Great Memory!"
        message={`You found all ${totalPairs} matches in ${moves} moves!`}
        onPlayAgain={resetGame}
        soundEffect="/audio/success.mp3"
      />
    </div>
  );
};
