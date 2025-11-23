import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { Swords } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import {
  TopBarContainer,
  TopBarLogo,
  TopBarLogoIcon,
  TopBarTitle,
} from "./TopBar.styles";

export const TopBar = () => {
  const location = useLocation();
  const { adventureId } = useParams<{ adventureId: string }>();

  const extractedAdventureId = useMemo(() => {
    // First try to get adventureId from params (works in nested routes)
    if (adventureId) return adventureId;

    // Otherwise, extract from pathname
    const match = location.pathname.match(/^\/adventure\/([^/]+)/);
    return match ? match[1] : null;
  }, [adventureId, location.pathname]);

  const isAdventureRoute = useMemo(() => {
    return !!extractedAdventureId;
  }, [extractedAdventureId]);

  if (!isAdventureRoute) {
    // AdventureManager view
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
        <AdventureTitleInput adventureId={extractedAdventureId} />
      </TopBarLogo>
      <AdventureNavigation adventureId={extractedAdventureId} />
    </TopBarContainer>
  );
};
