import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAvailablePuzzles } from "../games/registry";

// Format the slug for display
const formatName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Game card component
const GameCard = ({ title, type, slug, path }: { title: string; type: string; slug: string; path: string }) => {
  // Get thumbnail image for jigsaw puzzles
  const thumbnailSrc = type === "jigsaw" 
    ? `/images/jigsaw/${slug}.jpg` // Try jpg first
    : undefined;
  
  // Fallback to png if needed
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (type === "jigsaw") {
      (e.target as HTMLImageElement).src = `/images/jigsaw/${slug}.png`;
    }
  };

  return (
    <Link to={path} className="game-card">
      {type === "jigsaw" ? (
        <div className="game-thumbnail-container large">
          <img
            src={thumbnailSrc}
            alt={title}
            className="game-thumbnail"
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className={`game-icon ${type}`}>
          {type === "wordScramble" && "🔤"}
          {type === "wordSearch" && "🔍"}
          {type === "jigsaw" && "🧩"}
          {type === "memoryMatchIcon" && "🔄"}
        </div>
      )}
      <div className="game-info">
        {/* Only show title for non-jigsaw games */}
        {type !== "jigsaw" && <h3>{title}</h3>}
        <span className="game-type">
          {type === "wordScramble"
            ? "Word Scramble"
            : type === "wordSearch"
            ? "Word Search"
            : type === "jigsaw"
            ? "Jigsaw Puzzle"
            : "Memory Match"}
        </span>
      </div>
    </Link>
  );
};

export const HomePage = () => {
  const { wordScramble, jigsaw, wordSearch, memoryMatch } = getAvailablePuzzles();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the filter value from URL or default to "all"
  const filterParam = searchParams.get("filter") || "all";
  
  // Set the initial active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(filterParam);
  
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
    })),
    ...memoryMatch.map(slug => ({ 
      slug, 
      title: `${formatName(slug)} Memory Match`,
      type: "memoryMatchIcon",
      path: `/memorymatch/${slug}`
    }))
  ];
  
  // Function to handle tab changes
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    
    // Update URL parameter
    if (tabName === "all") {
      // Remove parameter for "all" to keep URL clean
      setSearchParams({});
    } else {
      setSearchParams({ filter: tabName });
    }
  };
  
  // Validate the URL parameter when component mounts
  useEffect(() => {
    // Valid filter values
    const validFilters = ["all", "wordScramble", "wordSearch", "jigsaw", "memoryMatchIcon"];
    
    // If filter parameter is invalid, redirect to the homepage with no filter
    if (filterParam !== "all" && !validFilters.includes(filterParam)) {
      navigate("/", { replace: true });
    }
  }, [filterParam, navigate]);
  
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
          onClick={() => handleTabChange("all")}
        >
          All Games
        </button>
        {wordScramble.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "wordScramble" ? "active" : ""}`}
            onClick={() => handleTabChange("wordScramble")}
          >
            Word Scrambles
          </button>
        )}
        {wordSearch.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "wordSearch" ? "active" : ""}`}
            onClick={() => handleTabChange("wordSearch")}
          >
            Word Searches
          </button>
        )}
        {jigsaw.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "jigsaw" ? "active" : ""}`}
            onClick={() => handleTabChange("jigsaw")}
          >
            Jigsaw Puzzles
          </button>
        )}
        {memoryMatch.length > 0 && (
          <button 
            className={`filter-btn ${activeTab === "memoryMatch" ? "active" : ""}`}
            onClick={() => handleTabChange("memoryMatchIcon")}
          >
            Memory Match
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
