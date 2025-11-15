import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAvailablePuzzles } from "../games/registry";
import { ProgressStats } from "./ProgressStats";

// Format the slug for display
const formatName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Game card component with brand styling
const GameCard = ({ title, type, slug, path }: { title: string; type: string; slug: string; path: string }) => {
  // Get thumbnail image for jigsaw puzzles
  const thumbnailSrc = type === "jigsaw"
    ? `/images/jigsaw/${slug}.jpg`
    : undefined;

  // Fallback to png if needed (with guard to prevent infinite loop)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (type !== "jigsaw") return;

    const img = e.target as HTMLImageElement;
    if (img.dataset.fallbackApplied === "true") return;

    img.dataset.fallbackApplied = "true";
    img.src = `/images/jigsaw/${slug}.png`;
  };

  // Get game type display name and gradient colors
  const getGameTypeInfo = (type: string) => {
    switch (type) {
      case "wordScramble":
        return { name: "Word Scramble", emoji: "🔤", gradient: "from-emerald-500 to-emerald-400" };
      case "wordSearch":
        return { name: "Word Search", emoji: "🔍", gradient: "from-violet-500 to-violet-400" };
      case "jigsaw":
        return { name: "Jigsaw Puzzle", emoji: "🧩", gradient: "from-amber-500 to-amber-400" };
      case "memoryMatchIcon":
        return { name: "Memory Match", emoji: "🔄", gradient: "from-emerald-500 to-violet-500" };
      case "quizGame":
        return { name: "Quiz Game", emoji: "❓", gradient: "from-violet-500 to-emerald-500" };
      default:
        return { name: "Game", emoji: "🎮", gradient: "from-emerald-500 to-violet-500" };
    }
  };

  const gameInfo = getGameTypeInfo(type);

  return (
    <Link
      to={path}
      className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
    >
      {/* Decorative pastel circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-violet-100 opacity-20"></div>

      {/* Gradient top strip */}
      <div className={`h-2 bg-gradient-to-r ${gameInfo.gradient}`}></div>

      <div className="p-6">
        {/* Icon or Image */}
        {type === "jigsaw" ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img
              src={thumbnailSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
            />
          </div>
        ) : (
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gameInfo.gradient} flex items-center justify-center text-4xl shadow-lg mb-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
            {gameInfo.emoji}
          </div>
        )}

        {/* Title - only show for non-jigsaw games */}
        {type !== "jigsaw" && (
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            {title}
          </h3>
        )}

        {/* Game Type Badge */}
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${gameInfo.gradient} mb-3`}>
          {gameInfo.name}
        </span>

        {/* CTA Row with Arrow */}
        <div className="flex items-center gap-2 text-emerald-600 font-medium mt-4 transition-transform duration-300 group-hover:translate-x-2">
          <span>Play Now</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export const HomePage = () => {
  const { wordScramble, jigsaw, wordSearch, memoryMatch, quizGame } = getAvailablePuzzles();
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
    })),
    ...quizGame.map(slug => ({
      slug,
      title: `${formatName(slug)} Quiz Game`,
      type: "quizGame",
      path: `/quiz/${slug}`
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
    const validFilters = ["all", "wordScramble", "wordSearch", "jigsaw", "memoryMatchIcon", "quizGame"];
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          {/* Central badge with gradient circle */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center shadow-hero">
              <span className="text-5xl">🎮</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 animate-pulse"></div>
          </div>

          {/* Large gradient headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
              Islamic Games Hub
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-2xl md:text-3xl font-medium text-slate-600 max-w-3xl mx-auto mb-6">
            Fun educational games to learn about Islam in an interactive way!
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
          </div>
        </div>

        {/* Progress Statistics */}
        <ProgressStats />

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg scale-105"
                : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Games
          </button>
          {wordScramble.length > 0 && (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "wordScramble"
                  ? "bg-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onClick={() => handleTabChange("wordScramble")}
            >
              Word Scrambles
            </button>
          )}
          {wordSearch.length > 0 && (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "wordSearch"
                  ? "bg-violet-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onClick={() => handleTabChange("wordSearch")}
            >
              Word Searches
            </button>
          )}
          {jigsaw.length > 0 && (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "jigsaw"
                  ? "bg-amber-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onClick={() => handleTabChange("jigsaw")}
            >
              Jigsaw Puzzles
            </button>
          )}
          {memoryMatch.length > 0 && (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "memoryMatchIcon"
                  ? "bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onClick={() => handleTabChange("memoryMatchIcon")}
            >
              Memory Match
            </button>
          )}
          {quizGame.length > 0 && (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "quizGame"
                  ? "bg-gradient-to-r from-violet-500 to-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onClick={() => handleTabChange("quizGame")}
            >
              Quiz Games
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* No Games Message */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-lg">
              <p className="text-xl text-slate-600">No games available in this category yet!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
