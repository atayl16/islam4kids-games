import { Link } from "react-router-dom";
import { getAvailablePuzzles } from "../games/registry";

// Format the slug for display
const formatName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const HomePage = () => {
  const { wordScramble, jigsaw } = getAvailablePuzzles();

  return (
    <div className="home-container">
      <h1>Islamic Games Hub</h1>
      <p className="home-description">
        Fun educational games to learn about Islam in an interactive way!
      </p>
      
      <div className="game-sections">
        {wordScramble.length > 0 && (
          <div className="game-section">
            <h2>Word Scramble Games</h2>
            <nav>
              {wordScramble.map(slug => (
                <Link key={slug} to={`/wordscramble/${slug}`} className="game-link">
                  {formatName(slug)} Word Scramble
                </Link>
              ))}
            </nav>
          </div>
        )}
        
        {jigsaw.length > 0 && (
          <div className="game-section">
            <h2>Jigsaw Puzzles</h2>
            <nav>
              {jigsaw.map(slug => (
                <Link key={slug} to={`/jigsaw/${slug}`} className="game-link">
                  {formatName(slug)} Jigsaw Puzzle
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
