import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Swords } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { ToggleButton } from "@/components/common";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import {
  TopBarContainer,
  TopBarLogo,
  TopBarLogoIcon,
  TopBarTitle,
  TopBarControls,
} from "./TopBar.styles";

export const TopBar = () => {
  const location = useLocation();
  const { adventureId } = useParams<{ adventureId: string }>();
  const [authorToolsEnabled, setAuthorToolsEnabled] = useState(false);

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

  const isTestView = useMemo(() => {
    return (
      location.pathname.includes("/test") &&
      !location.pathname.includes("/edit")
    );
  }, [location.pathname]);

  if (!isAdventureRoute || extractedAdventureId === null) {
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
      <TopBarControls>
        {isTestView && (
          <ToggleButton
            label="Author tools"
            checked={authorToolsEnabled}
            onChange={setAuthorToolsEnabled}
            data-testid={TOP_BAR_TEST_IDS.AUTHOR_TOOLS_TOGGLE}
          />
        )}
        <AdventureNavigation adventureId={extractedAdventureId} />
      </TopBarControls>
    </TopBarContainer>
  );
};
