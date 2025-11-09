import { Link, useLocation } from "react-router-dom";
import { Swords, Play, PenTool } from "lucide-react";
import { ROUTES } from "../constants/routes";
import "./TopBar.css";

export const TopBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-logo">
        <span className="top-bar-logo-icon" role="img" aria-label="swords">
          <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h1 className="top-bar-title">Adventure Book Companion</h1>
      </div>
      <nav className="top-bar-nav" aria-label="Main navigation">
        <Link
          to={ROUTES.TEST}
          className={`top-bar-nav-item ${
            isActive(ROUTES.TEST) ? "active" : ""
          }`}
        >
          <Play size={20} strokeWidth={1.5} aria-hidden="true" />
          <span>Test</span>
        </Link>
        <Link
          to={ROUTES.EDIT}
          className={`top-bar-nav-item ${
            isActive(ROUTES.EDIT) ? "active" : ""
          }`}
        >
          <PenTool size={20} strokeWidth={1.5} aria-hidden="true" />
          <span>Edit</span>
        </Link>
      </nav>
    </header>
  );
};
