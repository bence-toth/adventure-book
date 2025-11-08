import { Link, useLocation } from "react-router-dom";
import { GiCrossedSwords, GiPlayButton, GiFountainPen } from "react-icons/gi";
import "./TopBar.css";

export const TopBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-logo">
        <span className="top-bar-logo-icon" role="img" aria-label="sword">
          <GiCrossedSwords aria-hidden="true" />
        </span>
        <h1 className="top-bar-title">Adventure Book Companion</h1>
      </div>
      <nav className="top-bar-nav">
        <Link
          to="/"
          className={`top-bar-nav-item ${
            isActive("/") && !isActive("/edit") ? "active" : ""
          }`}
        >
          <GiPlayButton className="top-bar-nav-icon" aria-hidden="true" />
          <span>Test</span>
        </Link>
        <Link
          to="/edit"
          className={`top-bar-nav-item ${isActive("/edit") ? "active" : ""}`}
        >
          <GiFountainPen className="top-bar-nav-icon" aria-hidden="true" />
          <span>Edit</span>
        </Link>
      </nav>
    </header>
  );
};
