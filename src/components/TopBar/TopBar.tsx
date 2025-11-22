import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swords, Play, PenTool } from "lucide-react";
import { getStoryTestRoute, getStoryEditRoute } from "../../constants/routes";
import { ButtonLink } from "../common";
import { updateStoryTitle, getStory } from "../../data/storyDatabase";
import {
  TopBarContainer,
  TopBarLogo,
  TopBarLogoIcon,
  TopBarTitle,
  TopBarTitleInput,
  TopBarNav,
} from "./TopBar.styles";

export const TopBar = () => {
  const location = useLocation();
  const [storyTitle, setStoryTitle] = useState<string>("");

  // Extract storyId from pathname
  // Matches both /adventure/abc123/... and /abc123/... (for tests)
  const storyId = location.pathname.match(/^\/(?:adventure\/)?([^/]+)/)?.[1];
  const isStoryRoute = storyId && storyId !== "" && location.pathname !== "/";

  useEffect(() => {
    const loadStoryTitle = async () => {
      if (isStoryRoute) {
        const story = await getStory(storyId);
        if (story) {
          setStoryTitle(story.title);
        }
      }
    };
    loadStoryTitle();
  }, [storyId, isStoryRoute]);

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

  if (!isStoryRoute) {
    // DocumentManager view
    return (
      <TopBarContainer as="header">
        <TopBarLogo data-testid="top-bar-logo">
          <TopBarLogoIcon>
            <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
          </TopBarLogoIcon>
          <TopBarTitle>Adventure Book Companion</TopBarTitle>
        </TopBarLogo>
      </TopBarContainer>
    );
  }

  const testRoute = getStoryTestRoute(storyId);
  const editRoute = getStoryEditRoute(storyId);

  return (
    <TopBarContainer as="header">
      <TopBarLogo data-testid="top-bar-logo">
        <TopBarLogoIcon>
          <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
        </TopBarLogoIcon>
        <TopBarTitleInput
          type="text"
          value={storyTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled adventure"
          aria-label="Story title"
        />
      </TopBarLogo>
      <TopBarNav as="nav" aria-label="Main navigation">
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
      </TopBarNav>
    </TopBarContainer>
  );
};
