import { IslamicTheme } from "./components/IslamicTheme";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { WordScrambleContainer } from "./games/containers/WordScrambleContainer";
import { JigsawPuzzleContainer } from "./games/containers/JigsawPuzzleContainer";
import { WordSearchContainer } from "./games/containers/WordSearchContainer";
import { MemoryMatchContainer } from "./games/containers/MemoryMatchContainer"; // Import MemoryMatchContainer
import "./styles/base.css";
import "./styles/wordscramble.css";
import "./styles/jigsaw.css";
import "./styles/wordsearch.css";
import "./styles/memorymatch.css";

export default function App() {
  return (
    <HashRouter>
      <IslamicTheme />
      <div className="app">
        <Header />
        <main className="content">
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
              path="/wordsearch/:gameSlug" 
              element={
                <div className="game-container">
                  <WordSearchContainer />
                </div>
              } 
            />

            <Route 
              path="/embed/wordsearch/:gameSlug" 
              element={
                <div className="embed-wrapper">
                  <WordSearchContainer />
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

            {/* Add Memory Match routes */}
            <Route 
              path="/memorymatch/:categorySlug" 
              element={
                <div className="game-container">
                  <MemoryMatchContainer />
                </div>
              } 
            />

            <Route 
              path="/embed/memorymatch/:categorySlug" 
              element={
                <div className="embed-wrapper">
                  <MemoryMatchContainer />
                </div>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
