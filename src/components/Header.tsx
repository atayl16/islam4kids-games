import { Link } from "react-router-dom";
import "../styles/header.css";

export const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Islam4Kids Games
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};
