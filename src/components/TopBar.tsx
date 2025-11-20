import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Swords, Play, PenTool } from "lucide-react";
import { getStoryTestRoute, getStoryEditRoute } from "../constants/routes";
import { ButtonLink } from "./ButtonLink";
import { StoryContext } from "../context/StoryContext";
import { updateStoryTitle, getStory } from "../data/storyDatabase";
import "./TopBar.css";

export const TopBar = () => {
  const location = useLocation();
  const context = useContext(StoryContext);
  const storyId = context?.storyId ?? null;
  const [storyTitle, setStoryTitle] = useState<string>("");

  useEffect(() => {
    const loadStoryTitle = async () => {
      if (storyId) {
        const story = await getStory(storyId);
        if (story) {
          setStoryTitle(story.title);
        }
      }
    };
    loadStoryTitle();
  }, [storyId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (storyId && storyTitle.trim()) {
      try {
        await updateStoryTitle(storyId, storyTitle.trim());
      } catch (err) {
        console.error("Failed to update story title:", err);
      }
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  if (!storyId) {
    // DocumentManager view
    return (
      <header className="top-bar">
        <div className="top-bar-logo" data-testid="top-bar-logo">
          <span className="top-bar-logo-icon">
            <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h1 className="top-bar-title">Adventure Book Companion</h1>
        </div>
      </header>
    );
  }

  const testRoute = getStoryTestRoute(storyId);
  const editRoute = getStoryEditRoute(storyId);

  return (
    <header className="top-bar">
      <div className="top-bar-logo" data-testid="top-bar-logo">
        <span className="top-bar-logo-icon">
          <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <input
          type="text"
          className="top-bar-title-input"
          value={storyTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled adventure"
          aria-label="Story title"
        />
      </div>
      <nav className="top-bar-nav" aria-label="Main navigation">
        <ButtonLink
          to={testRoute}
          selected={isActive(testRoute)}
          size="small"
          icon={Play}
        >
          Test
        </ButtonLink>
        <ButtonLink
          to={editRoute}
          selected={isActive(editRoute)}
          size="small"
          icon={PenTool}
        >
          Edit
        </ButtonLink>
      </nav>
    </header>
  );
};
