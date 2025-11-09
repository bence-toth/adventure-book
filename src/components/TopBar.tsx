import { useLocation } from "react-router-dom";
import { Swords, Play, PenTool } from "lucide-react";
import { ROUTES } from "../constants/routes";
import { ButtonLink } from "./ButtonLink";
import "./TopBar.css";

export const TopBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-logo" data-testid="top-bar-logo">
        <span className="top-bar-logo-icon">
          <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h1 className="top-bar-title">Adventure Book Companion</h1>
      </div>
      <nav className="top-bar-nav" aria-label="Main navigation">
        <ButtonLink
          to={ROUTES.TEST}
          selected={isActive(ROUTES.TEST)}
          size="small"
          icon={Play}
        >
          Test
        </ButtonLink>
        <ButtonLink
          to={ROUTES.EDIT}
          selected={isActive(ROUTES.EDIT)}
          size="small"
          icon={PenTool}
        >
          Edit
        </ButtonLink>
      </nav>
    </header>
  );
};
