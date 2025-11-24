import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { ToggleButton } from "@/components/common";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";

export const TestAdventureTopBar = () => {
  const location = useLocation();
  const { adventureId } = useParams<{ adventureId: string }>();
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
          }}
          data-testid={TOP_BAR_TEST_IDS.LOGO}
        >
          <BackButton />
          <AdventureTitleInput adventureId={adventureId} />
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
          <AdventureNavigation adventureId={adventureId} />
        </>
      }
    />
  );
};
