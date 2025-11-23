import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swords, Play, PenTool, ArrowLeft } from "lucide-react";
import {
  getStoryTestRoute,
  getStoryEditRoute,
  ROUTES,
} from "@/constants/routes";
import { Button, ButtonLink } from "@/components/common";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { updateStoryTitle, getStory } from "@/data/storyDatabase";
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
  const navigate = useNavigate();
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
        <TopBarLogo data-testid={TOP_BAR_TEST_IDS.LOGO}>
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

  const handleBackClick = () => {
    navigate(ROUTES.ROOT);
  };

  return (
    <TopBarContainer as="header">
      <TopBarLogo data-testid={TOP_BAR_TEST_IDS.LOGO}>
        <Button
          onClick={handleBackClick}
          icon={ArrowLeft}
          aria-label="Back to document manager"
          data-testid={TOP_BAR_TEST_IDS.BACK_BUTTON}
          size="small"
        />
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
