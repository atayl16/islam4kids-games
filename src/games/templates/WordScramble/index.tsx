import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { WordScrambleData } from "./types";
import CompletionOverlay from "../../../components/game-common/CompletionOverlay";
import { PuzzleControls } from "../../../components/game-common/PuzzleControls";
import Letter from "./Letter";

export const WordScramble = ({ data }: { data: WordScrambleData }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [correctSolution, setCorrectSolution] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [filteredWords, setFilteredWords] = useState<typeof data.words>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for overlay visibility
  const [isMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  // Define difficulty letter count boundaries
  const difficultyRanges = {
    easy: { min: 2, max: 4 },
    medium: { min: 2, max: 7 },
    hard: { min: 2, max: 100 },
  };

  // Filter words based on difficulty level
  useEffect(() => {
    if (data?.words?.length > 0) {
      const range = difficultyRanges[difficulty as keyof typeof difficultyRanges];
      const filtered = data.words.filter((word) => {
        const length = word.solution.length;
        return length >= range.min && length <= range.max;
      });

      if (filtered.length === 0) {
        console.warn(`No words available for difficulty level: ${difficulty}`);
        setFilteredWords(data.words);
      } else {
        setFilteredWords(filtered);
      }

      setCurrentWordIndex(0);
      setIsOverlayVisible(false); // Reset overlay visibility
    }
  }, [difficulty, data]);

  // Initialize word when current index or filtered words change
  useEffect(() => {
    if (filteredWords && filteredWords.length > 0) {
      initializeWord();
    }
  }, [currentWordIndex, filteredWords]);

  const scrambleWord = (solution: string[]): string[] => {
    let scrambled = [...solution];

    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }

    if (scrambled.join("") === solution.join("")) {
      if (scrambled.length >= 2) {
        const pos1 = Math.floor(Math.random() * scrambled.length);
        let pos2 = Math.floor(Math.random() * scrambled.length);
        while (pos2 === pos1) {
          pos2 = Math.floor(Math.random() * scrambled.length);
        }
        [scrambled[pos1], scrambled[pos2]] = [scrambled[pos2], scrambled[pos1]];
      }
    }

    return scrambled;
  };

  const initializeWord = () => {
    if (!filteredWords || filteredWords.length === 0) {
      console.error("No words available for scramble game");
      return;
    }

    if (currentWordIndex >= filteredWords.length) {
      console.error("Word index out of bounds");
      return;
    }

    const currentWord = filteredWords[currentWordIndex];
    if (!currentWord?.solution) {
      console.error("Invalid word data at index", currentWordIndex);
      return;
    }

    const solution = currentWord.solution.split("");
    const scrambled = scrambleWord(solution);
    setLetters(scrambled);
    setCorrectSolution(false);
  };

  const moveChar = (fromIndex: number, toIndex: number) => {
    const newLetters = [...letters];
    const [removed] = newLetters.splice(fromIndex, 1);
    newLetters.splice(toIndex, 0, removed);
    setLetters(newLetters);
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio("/audio/success.mp3");
      audio.play().catch((error) => {
        console.error("Failed to play success sound:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  };

  const checkSolution = () => {
    if (!filteredWords || currentWordIndex >= filteredWords.length) {
      return;
    }

    const currentWord = filteredWords[currentWordIndex];
    if (!currentWord?.solution) return;

    const attempt = letters.join("");

    if (attempt === currentWord.solution) {
      setCorrectSolution(true);
      playSuccessSound();

      setTimeout(() => {
        if (currentWordIndex < filteredWords.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          setIsOverlayVisible(true); // Show overlay when game is complete
        }
      }, 1500);
    }
  };

  const resetWord = () => {
    initializeWord();
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setIsOverlayVisible(false); // Reset overlay visibility
    initializeWord();
  };

  if (!data?.words || data.words.length === 0) {
    return <div className="word-scramble-loading">Loading word puzzle...</div>;
  }

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="word-scramble">
        <h2 className="scramble-title">
          {data.meta?.title || "Word Scramble"}
        </h2>
        <p className="scramble-instructions">
          {data.meta?.instructions ||
            "Rearrange the letters to form the correct word."}
        </p>

        <PuzzleControls
          currentDifficulty={difficulty}
          solvedCount={currentWordIndex}
          totalPieces={filteredWords.length}
          onScramble={resetWord}
          scrambleLabel="Reset Word"
          progressLabel={(solved, total) => `Word ${solved + 1} of ${total}`}
          difficultyOptions={[
            { value: "easy", label: "Easy (2-4 letters only)" },
            { value: "medium", label: "Medium (up to 7 letters)" },
            { value: "hard", label: "Hard (all words)" },
          ]}
          onDifficultyChange={(newDifficulty) => {
            setDifficulty(newDifficulty);
          }}
          hintButton={
            <button
              onClick={() => setShowHint(!showHint)}
              className="hint-toggle-button"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          }
        />

        <div className="letter-container" role="region">
          {letters.map((char, i) => (
            <Letter
              key={i}
              char={char}
              index={i}
              moveChar={moveChar}
              onDrop={checkSolution}
            />
          ))}

          {correctSolution && (
            <div
              className="solution-correct-overlay"
              aria-label="Correct solution"
            >
              <div className="checkmark">✓</div>
            </div>
          )}

          {showHint && filteredWords[currentWordIndex] && (
            <div className="hint-box">
              <h3>Hint:</h3>
              <p>
                {filteredWords[currentWordIndex].hint || "No hint available"}
              </p>
              {filteredWords[currentWordIndex].reference && (
                <p className="reference">
                  Reference: {filteredWords[currentWordIndex].reference}
                </p>
              )}
            </div>
          )}

          <CompletionOverlay
            isVisible={isOverlayVisible}
            setIsVisible={setIsOverlayVisible} // Pass setIsVisible to allow closing
            title="Mashallah! Word Master!"
            message={`You've unscrambled all ${filteredWords.length} words!`}
            onPlayAgain={resetGame}
            soundEffect="/audio/success.mp3"
          />
        </div>

        {filteredWords[currentWordIndex] && (
          <div className="word-translation">
            <p>
              <i>{filteredWords[currentWordIndex].reference}</i>
            </p>
          </div>
        )}
      </div>
    </DndProvider>
  );
};
