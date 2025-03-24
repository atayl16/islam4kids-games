import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { WordScrambleData } from './types';

const Letter = ({ char, index, moveChar }: { 
  char: string; 
  index: number;
  moveChar: (from: number, to: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "letter",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "letter",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveChar(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`letter-tile ${isDragging ? "dragging" : ""}`}
      aria-label={`Letter ${char}, position ${index + 1}`}
    >
      {char}
    </div>
  );
};

export const WordScramble = ({ data }: { data: WordScrambleData }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isMobile] = useState(() => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  useEffect(() => initializeWord(), [currentWordIndex, data]);

  const scrambleWord = (solution: string[]): string[] => {
    let scrambled = [...solution];
    
    // Fisher-Yates shuffle algorithm for better randomization
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    
    // Check if scrambled word is the same as original
    if (scrambled.join('') === solution.join('')) {
      // If it's the same, swap a couple of characters or try again
      if (scrambled.length >= 2) {
        // Force a swap of two characters
        const pos1 = Math.floor(Math.random() * scrambled.length);
        let pos2 = Math.floor(Math.random() * scrambled.length);
        while (pos2 === pos1) {
          pos2 = Math.floor(Math.random() * scrambled.length);
        }
        [scrambled[pos1], scrambled[pos2]] = [scrambled[pos2], scrambled[pos1]];
      } else {
        // For single character words, there's nothing to scramble
        console.warn("Word too short to scramble:", solution.join(''));
      }
    }
    
    return scrambled;
  };

  const initializeWord = () => {
    if (data.words && data.words.length > 0) {
      const solution = data.words[currentWordIndex].solution.split('');
      const scrambled = scrambleWord(solution);
      setLetters(scrambled);
    }
  };

  const moveChar = (fromIndex: number, toIndex: number) => {
    const newLetters = [...letters];
    const [removed] = newLetters.splice(fromIndex, 1);
    newLetters.splice(toIndex, 0, removed);
    setLetters(newLetters);
  };

  const checkSolution = () => {
    const currentWord = data.words[currentWordIndex];
    const attempt = letters.join('');
    
    if (attempt === currentWord.solution) {
      new Audio('/audio/success.mp3').play();
      if (currentWordIndex < data.words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        new Audio('/audio/completion.mp3').play();
      }
    }
  };

  const resetWord = () => {
    initializeWord();
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="word-scramble">
        <h2 className="scramble-title">{data.meta.title}</h2>
        <p className="scramble-instructions">{data.meta.instructions}</p>

        <div className="letter-container" role="region">
          {letters.map((char, i) => (
            <Letter key={i} char={char} index={i} moveChar={moveChar} />
          ))}
        </div>

        <div className="scramble-controls">
          <button className="scramble-button" onClick={checkSolution}>Check Answer</button>
          <button className="scramble-button" onClick={() => setShowHint(!showHint)}>
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          <button className="scramble-button" onClick={resetWord}>
            Reset
          </button>
        </div>

        {showHint && (
          <div className="hint-box">
            <h3>Hint:</h3>
            <p>{data.words[currentWordIndex].hint}</p>
            <p className="reference">
              Reference: {data.words[currentWordIndex].reference}
            </p>
          </div>
        )}
      </div>
    </DndProvider>
  );
};
