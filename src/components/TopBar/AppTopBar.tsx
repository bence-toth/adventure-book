import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Swords } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { ToggleButton } from "@/components/common";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import { TopBarLogoIcon, TopBarTitle } from "./AppTopBar.styles";

export const AppTopBar = () => {
  const location = useLocation();
  const { adventureId } = useParams<{ adventureId: string }>();
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

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
      <TopBar
        start={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
            }}
            data-testid={TOP_BAR_TEST_IDS.LOGO}
          >
            <TopBarLogoIcon>
              <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
            </TopBarLogoIcon>
            <TopBarTitle>Adventure Book Companion</TopBarTitle>
          </div>
        }
      />
    );
  }

  return (
    <TopBar
      start={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
          }}
          data-testid={TOP_BAR_TEST_IDS.LOGO}
        >
          <BackButton />
          <AdventureTitleInput adventureId={extractedAdventureId} />
        </div>
      }
      end={
        <>
          {isTestView && (
            <ToggleButton
              label="Debug mode"
              checked={debugModeEnabled}
              onChange={setDebugModeEnabled}
              data-testid={TOP_BAR_TEST_IDS.AUTHOR_TOOLS_TOGGLE}
            />
          )}
          <AdventureNavigation adventureId={extractedAdventureId} />
        </>
      }
    />
  );
};
