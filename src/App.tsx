import { IslamicTheme } from "./components/IslamicTheme";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { WordScrambleContainer } from "./games/containers/WordScrambleContainer";
import { JigsawPuzzleContainer } from "./games/containers/JigsawPuzzleContainer";
import "./styles/base.css";
import "./styles/wordscramble.css";
import "./styles/jigsaw.css";

export default function App() {
  return (
    <HashRouter>
      <IslamicTheme />
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route 
          path="/wordscramble/:gameSlug" 
          element={
            <div className="game-container">
              <WordScrambleContainer />
            </div>
          } 
        />

        <Route 
          path="/embed/wordscramble/:gameSlug" 
          element={
            <div className="embed-wrapper">
              <WordScrambleContainer />
            </div>
          } 
        />

        <Route 
          path="/jigsaw/:puzzleSlug" 
          element={
            <div className="game-container">
              <JigsawPuzzleContainer />
            </div>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
