import { IslamicTheme } from "./components/IslamicTheme";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { WordScrambleContainer } from "./games/containers/WordScrambleContainer";
import { JigsawPuzzleContainer } from "./games/containers/JigsawPuzzleContainer";
import { WordSearchContainer } from "./games/containers/WordSearchContainer";
import { MemoryMatchContainer } from "./games/containers/MemoryMatchContainer";
import { QuizGameContainer } from "./games/containers/QuizGameContainer";
import "./styles/tailwind.css";
import "./styles/aboutpage.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/homepage.css";
import "./styles/jigsaw.css";
import "./styles/memorymatch.css";
import "./styles/shared.css";
import "./styles/wordscramble.css";
import "./styles/wordsearch.css";
import "./styles/quizgame.css";

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <IslamicTheme />
        <div className="app">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
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
              <Route
                path="/quiz/:quizSlug"
                element={
                  <div className="game-container">
                    <QuizGameContainer />
                  </div>
                }
              />
              <Route
                path="/embed/quiz/:quizSlug"
                element={
                  <div className="embed-wrapper">
                    <QuizGameContainer />
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
