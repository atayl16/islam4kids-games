import { useState } from "react";
import { Link } from "react-router-dom";
import { getAvailablePuzzles } from "../games/registry";

// Format the slug for display
const formatName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Game card component
const GameCard = ({ title, type, path }: { title: string; type: string; slug: string; path: string }) => {
  return (
    <Link to={path} className="game-card">
      <div className={`game-icon ${type}`}>
        {type === "wordScramble" && "🔤"}
        {type === "wordSearch" && "🔍"}
        {type === "jigsaw" && "🧩"}
      </div>
      <div className="game-info">
        <h3>{title}</h3>
        <span className="game-type">{type === "wordScramble" ? "Word Scramble" : 
                                    type === "wordSearch" ? "Word Search" : "Jigsaw"}</span>
      </div>
    </Link>
  );
};

export const HomePage = () => {
  const { wordScramble, jigsaw, wordSearch } = getAvailablePuzzles();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Create an array of all games with their types
  const allGames = [
    ...wordScramble.map(slug => ({ 
      slug, 
      title: `${formatName(slug)} Word Scramble`,
      type: "wordScramble",
      path: `/wordscramble/${slug}`
    })),
    ...wordSearch.map(slug => ({ 
      slug, 
      title: `${formatName(slug)} Word Search`,
      type: "wordSearch",
      path: `/wordsearch/${slug}`
    })),
    ...jigsaw.map(slug => ({ 
      slug, 
      title: `${formatName(slug)} Jigsaw Puzzle`,
      type: "jigsaw",
      path: `/jigsaw/${slug}`
    }))
  ];
  
  // Filter games based on active tab
  const filteredGames = activeTab === "all" 
    ? allGames
    : allGames.filter(game => game.type === activeTab);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Islamic Games Hub</h1>
        <p className="home-description">
          Fun educational games to learn about Islam in an interactive way!
        </p>
      </div>
      
      <div className="game-filter">
        <button 
          className={`filter-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Games
        </button>
        {wordScramble.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "wordScramble" ? "active" : ""}`}
            onClick={() => setActiveTab("wordScramble")}
          >
            Word Scrambles
          </button>
        )}
        {wordSearch.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "wordSearch" ? "active" : ""}`}
            onClick={() => setActiveTab("wordSearch")}
          >
            Word Searches
          </button>
        )}
        {jigsaw.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "jigsaw" ? "active" : ""}`}
            onClick={() => setActiveTab("jigsaw")}
          >
            Jigsaw Puzzles
          </button>
        )}
      </div>
      
      <div className="games-grid">
        {filteredGames.map(game => (
          <GameCard
            key={`${game.type}-${game.slug}`}
            title={formatName(game.slug)}
            type={game.type}
            slug={game.slug}
            path={game.path}
          />
        ))}
      </div>
      
      {filteredGames.length === 0 && (
        <div className="no-games">
          <p>No games available in this category yet!</p>
        </div>
      )}
    </div>
  );
};
