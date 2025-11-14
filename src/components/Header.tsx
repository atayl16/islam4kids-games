import { Link } from "react-router-dom";
import "../styles/header.css";

export const Header = () => {
  return (
    <header className="app-header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Islam4Kids Games home">
          Islam4Kids Games
        </Link>
        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <Link to="/" className="nav-link" aria-label="Go to home page">
            Home
          </Link>
          <Link to="/about" className="nav-link" aria-label="Go to about page">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};
