import { IslamicTheme } from "./components/IslamicTheme";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { AchievementsPage } from "./components/AchievementsPage";
import { AchievementManager } from "./components/AchievementManager";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProgressProvider } from "./contexts/ProgressContext";
import { WordScrambleContainer } from "./games/containers/WordScrambleContainer";
import { JigsawPuzzleContainer } from "./games/containers/JigsawPuzzleContainer";
import { WordSearchContainer } from "./games/containers/WordSearchContainer";
import { MemoryMatchContainer } from "./games/containers/MemoryMatchContainer";
import { QuizGameContainer } from "./games/containers/QuizGameContainer";
import { SlidingPuzzleContainer } from "./games/containers/SlidingPuzzleContainer";
import "./styles/tailwind.css";

export default function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <HashRouter>
          <IslamicTheme />
          <AchievementManager />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg">
            Skip to main content
          </a>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30">
            <Header />
            <main id="main-content" role="main">
              <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route
              path="/wordscramble/:gameSlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
                  <div className="max-w-7xl mx-auto">
                    <WordScrambleContainer />
                  </div>
                </div>
              }
            />
            <Route
              path="/embed/wordscramble/:gameSlug"
              element={
                <div className="p-4">
                  <WordScrambleContainer />
                </div>
              }
            />
            <Route
              path="/wordsearch/:gameSlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
                  <div className="max-w-7xl mx-auto">
                    <WordSearchContainer />
                  </div>
                </div>
              }
            />
            <Route
              path="/embed/wordsearch/:gameSlug"
              element={
                <div className="p-4">
                  <WordSearchContainer />
                </div>
              }
            />
            <Route
              path="/jigsaw/:puzzleSlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
                  <div className="max-w-7xl mx-auto">
                    <JigsawPuzzleContainer />
                  </div>
                </div>
              }
            />
            <Route
              path="/memorymatch/:categorySlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
                  <div className="max-w-7xl mx-auto">
                    <MemoryMatchContainer />
                  </div>
                </div>
              }
            />
            <Route
              path="/embed/memorymatch/:categorySlug"
              element={
                <div className="p-4">
                  <MemoryMatchContainer />
                </div>
              }
            />
            <Route
              path="/quiz/:quizSlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-8 px-4">
                  <div className="max-w-7xl mx-auto">
                    <QuizGameContainer />
                  </div>
                </div>
              }
            />
            <Route
              path="/embed/quiz/:quizSlug"
              element={
                <div className="p-4">
                  <QuizGameContainer />
                </div>
              }
            />
            <Route
              path="/sliding-puzzle/:puzzleSlug"
              element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30">
                  <SlidingPuzzleContainer />
                </div>
              }
            />
            <Route
              path="/embed/sliding-puzzle/:puzzleSlug"
              element={
                <div className="p-4">
                  <SlidingPuzzleContainer />
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </ProgressProvider>
    </ErrorBoundary>
  );
}
