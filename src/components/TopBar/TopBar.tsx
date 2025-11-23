import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { Swords } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { BackButton } from "./BackButton/BackButton";
import { StoryTitleInput } from "./StoryTitleInput/StoryTitleInput";
import { StoryNavigation } from "./StoryNavigation/StoryNavigation";
import {
  TopBarContainer,
  TopBarLogo,
  TopBarLogoIcon,
  TopBarTitle,
} from "./TopBar.styles";

export const TopBar = () => {
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();

  const extractedStoryId = useMemo(() => {
    // First try to get storyId from params (works in nested routes)
    if (storyId) return storyId;

    // Otherwise, extract from pathname
    const match = location.pathname.match(/^\/adventure\/([^/]+)/);
    return match ? match[1] : null;
  }, [storyId, location.pathname]);

  const isStoryRoute = useMemo(() => {
    return !!extractedStoryId;
  }, [extractedStoryId]);

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

  return (
    <TopBarContainer as="header">
      <TopBarLogo data-testid={TOP_BAR_TEST_IDS.LOGO}>
        <BackButton />
        <StoryTitleInput storyId={extractedStoryId!} />
      </TopBarLogo>
      <StoryNavigation storyId={extractedStoryId!} />
    </TopBarContainer>
  );
};
