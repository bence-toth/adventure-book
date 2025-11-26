import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { useAdventure } from "@/context/useAdventure";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import { TopBarStartContainer } from "./TestAdventureTopBar.styles";

export const TestAdventureTopBar = () => {
  const location = useLocation();
  const { adventureId } = useParams<{ adventureId: string }>();
  const { debugModeEnabled, setDebugModeEnabled } = useAdventure();

  const isTestView = useMemo(() => {
    return (
      location.pathname.includes("/test") &&
      !location.pathname.includes("/edit")
    );
  }, [location.pathname]);

  if (!adventureId) {
    return null;
  }

  return (
    <TopBar
      start={
        <TopBarStartContainer data-testid={TOP_BAR_TEST_IDS.LOGO}>
          <BackButton />
          <AdventureTitleInput adventureId={adventureId} />
        </TopBarStartContainer>
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
          <AdventureNavigation adventureId={adventureId} />
        </>
      }
    />
  );
};
